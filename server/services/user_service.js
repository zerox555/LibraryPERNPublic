const db = require('../models')
const { User } = db
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const { getPermissionsByRole } = require("./role_service");
const logger = require("../config/logger");
const AppError = require("../appError");
require('dotenv').config();

// ADD NEW USER TO DB
const create_user_post = async (userData) => {
    try {
        // Validite user credentials
        if (!(userData.name && userData.password)){
            throw new AppError('USER_CREATION_FAILED', 400, 'Username and password cannot be empty!');
        }
        const hash = await argon2.hash(userData.password);
        const newUser = await User.create({
            name: userData.name,
            password: hash,
            roles: ["user"]
        }
        );
        const userCreationResponse={
            newUser,
            success:true,
        }
        logger.info(`Created user : ${JSON.stringify(newUser,null,2)} @ user_service`);
        return userCreationResponse;
    } catch (err) {
        logger.warn("Error creating user @ user_service: " + err.message);
        // If is db problem
        throw new AppError('USER_CREATION_FAILED', 500, 'Cannot create user at this time, please try again later');
    }
};

// AUTHENTICATE USER
const auth_user = async (userData) => {
    let token;
    let permissions;
    let errorMsg = "";

    try {
        let authenticated = false;
        const user = await User.findOne({
            where: {
                name: userData.name
            }
        });

        if (!user) {
            // Log the error and throw AppError if user is not found
            logger.warn(`User with name: ${userData.name} not found in database @ user_service`);
            throw new AppError("USER_AUTH_FAILED", 404, `User with name: ${userData.name} not found in database @ user_service`);
        }

        if (user && !(await argon2.verify(user.password, userData.password))) {
            // Log the error and throw AppError if password doesn't match
            logger.warn(`Incorrect password for user: ${userData.name} @ user_service`);
            throw new AppError("USER_AUTH_FAILED", 401, "Incorrect password provided.");
        }

        logger.info(`User: ${user.name} found in database @ user_service`);
        authenticated = true;

        // Set JWT token
        try {
            permissions = getPermissionsByRole(user.roles);
            if (permissions.length === 0) {
                // Log the error and throw AppError if no permissions are found
                logger.warn(`Error occured @ user_service: Invalid token and permissions`);
                throw new AppError("USER_AUTH_FAILED", 403, "No permissions found for the user.");
            }

            token = jwt.sign(
                {
                    id: user.id,
                    name: userData.name,
                    roles: user.roles,
                    permissions: permissions
                },
                process.env.REACT_APP_JWT_SECRET,
                { expiresIn: "1h" }
            );
            logger.info(`JWT token signed for user: ${userData.name} @ user_service`);
        } catch (err) {
            // Log the error and throw AppError for JWT signing failure
            logger.error(`Error signing JWT token for user: ${userData.name} @ user_service: ${err.message}`);
            throw new AppError("USER_JWT_ERROR", 500, "Error signing JWT token @ user_service: " + err.message);
        }

        // Return response with token and permissions if everything is successful
        logger.info(`User logged in successfully: ${userData.name} @ user_service`);
        return {
            success: authenticated,
            data: {
                id: user.id,
                name: userData.name,
                roles: user.roles,
                permissions: permissions,
                token: token,
            }
        };

    } catch (err) {
        // Catch and log the error for further processing by the middleware
        if (err instanceof AppError) {
            logger.error(`AppError encountered: ${err.message} (Code: ${err.code}, Status: ${err.statusCode})`);
            throw err; // If it's already an AppError, throw it
        } else {
            // If it's an unexpected error, wrap it into AppError and log it
            logger.error(`Unexpected error during user authentication: ${err.message}`);
            throw new AppError("USER_AUTH_FAILED", 500, "Unexpected error during user authentication @ user_service: " + err.message);
        }
    }
};

module.exports = {
    create_user_post,
    auth_user
}