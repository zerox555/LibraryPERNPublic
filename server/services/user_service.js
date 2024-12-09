const db = require('../models')
const { User } = db
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const { getPermissionsByRole } = require("./role_service");
const logger = require("../config/logger")
require('dotenv').config();

// ADD NEW USER TO DB
const create_user_post = async (userData) => {
    try {
        const hash = await argon2.hash(userData.password);
        const newUser = await User.create({
            name: userData.name,
            password: hash,
            roles: ["user"]
        }
        );
        logger.info(`Created User: ${userData.name} with roles: user`);
        return newUser;
    } catch (err) {
        Alert("Error creating user: " + err.message);
    }
};

// AUTHENTICATE USER
const auth_user = async (userData) => {
    let token;
    let permissions;
    try {
        let authenticated = false;
        const user = await User.findOne({
            where: {
                name: userData.name
            }
        })


        if (user && (await argon2.verify(user.password, userData.password))) {
            authenticated = true
            logger.info(`Found User with username: ${user.name}`)
            logger.info("User authentication success");
            //set jwt token here 
            try {
                //Creating JWT token
                permissions = getPermissionsByRole(user.roles);
                logger.debug(`permissions length: ${permissions.length}`);
                if (permissions.length != 0) {
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
                    logger.debug(`JWT token created: ${token}`);
                    logger.info("JWT token created");
                }
            } catch (err) {
                logger.error("Error creating JWT token");
                const error =
                    new Error("Error! Something went wrong.");
                return next(error);
            }
        }
        else {
            //invalid login
            logger.warn(`Invalid login detected with username: ${userData.name}`);
        }
        logger.debug(`User authenticated: ${authenticated}`);

        if (token && permissions.length > 0) {
            return {
                success: authenticated,
                data: authenticated
                    ? {
                        id: user.id,
                        name: userData.name,
                        roles: user.roles,
                        permissions: permissions,
                        token: token,
                    }
                    : { errorMsg: "Error logging user in!" },
            };
        }

        return {
            success: authenticated,
            data: {
                errorMsg: "Error loading roles: Please contact an admin!",
            },
        };

    } catch (err) {
        logger.error(`Error occured: ${err}`);
        throw new Error(err);
    }
};

module.exports = {
    create_user_post,
    auth_user
}