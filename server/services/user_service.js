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
        logger.info(`Created user: ${JSON.stringify(newUser)}`);
        return newUser;
    } catch (err) {
        logger.warn("Error creating user: " + err.message);
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
            logger.info(`User: ${user.name} found in database`);
            authenticated = true
            //set jwt token here 
            try {
                //Creating JWT token
                permissions = getPermissionsByRole(user.roles);
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
                    logger.info(`JWT token signed: ${token}`);
                }
            } catch (err) {
                logger.warn(`Error Occured: ${err}`)
                const error =
                    new Error("Error! Something went wrong.");
                return next(error);
            }
        }
        else {
            errorMsg = "Error finding user";
            logger.warn(`User with name: ${userData.name} not found in database`)
            logger.warn(`User not logged in`);
            return {
                success: authenticated,
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
            logger.info(`User logged in: ${JSON.stringify(userInfo)}`);
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
            errorMsg = "Error loading roles: Please contact an admin!";
            logger.warn(`Error occured : Invalid token and permissions`);
        }
        // unsuccessful user login
        logger.warn(`User not logged in`);
        return {
            success: authenticated,
            data: {
                errorMsg: errorMsg,
            },
        };

    } catch (err) {
        logger.warn(`Error Occured: ${err}`);
    }
};

module.exports = {
    create_user_post,
    auth_user
}