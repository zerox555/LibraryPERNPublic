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
            errorMsg:""
        }
        logger.info(`Created user : ${JSON.stringify(newUser,null,2)} @ user_service`);
        return userCreationResponse;
    } catch (err) {
        logger.warn("Error creating user @ user_service: " + err.message);
        // If is db problem
        throw new AppError('USER_CREATION_FAILED', 500, 'Cannot create user at this time, please try again later');

        // return {
        //     success: false,
        //     error: {
        //       errorCode: "USER_CREATION_FAILED",
        //       message: "Cannot create user at this time, please try again later",
        //       httpStatus: 500,
        //     },
        //     timestamp: "2024-12-16T12:34:56Z"
        //   }

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
        })

        if (user && (await argon2.verify(user.password, userData.password))) {
            logger.info(`User: ${user.name} found in database @ user_service`);
            authenticated = true
            //set jwt token here 
            try {
                //Creating JWT token
                permissions = getPermissionsByRole(user.roles);
                if (permissions.length != 0) {
                    console.log(permissions);
                    token = jwt.sign(
                        {
                            id: user.id,
                            name: userData.name,
                            roles: user.roles,
                            permissions: permissions
                        },
                        // secret key value
                        process.env.REACT_APP_JWT_SECRET,
                        { expiresIn: "1h" }
                    )
                    logger.info(`JWT token signed: ${token} @ user_service`);
                }
            } catch (err) {
                logger.warn(`Error Occured @ user_service: ${err}`)
                // const error =
                //     new Error("Error! Something went wrong.");
                // return next(error);
                errorMsg="Error! Something went wrong."
                return {
                    success: false,
                    data: {
                        errorMsg: errorMsg,
                    },
                };
            }
        }
        else {
            errorMsg = "Error finding user @ user_service";
            logger.warn(`User with name: ${userData.name} not found in database @ user_service`)
            logger.warn(`User not logged in @ user_service`);
            return {
                success: false,
                data: {
                    errorMsg: errorMsg,
                },
            };
        }

        if (token && permissions.length > 0) {
            
            const userInfo = {
                id:user.id,
                name : user.name,
                roles:user.roles
            }
            logger.info(`User logged in: ${JSON.stringify(userInfo,null,3)} @ user_service`);
            // succesful user login
            return {
                success: authenticated,
                data: authenticated
                    ? {
                        id: user.id,
                        name: userData.name,
                        roles: user.roles,
                        permissions: permissions,
                        token: token,
                        errorMsg:""
                    }
                    : { errorMsg: errorMsg },
            };
        } else {
            errorMsg = "Error loading roles @ user_service: Please contact an admin!";
            logger.warn(`Error occured @ user_service: Invalid token and permissions`);
        }
        // unsuccessful user login
        logger.warn(`User not logged in @ user_service`);
        return {
            success: false,
            data: {
                errorMsg: errorMsg,
            },
        };

    } catch (err) {
        logger.warn(`Error Occured @ user_service: ${err}`);
    }
};

module.exports = {
    create_user_post,
    auth_user
}