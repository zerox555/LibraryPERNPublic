const fs = require('fs');
const path = require('path');
const logger = require("../config/logger")
const AppError = require("../appError");
require('dotenv').config();

let rolesData;

const loadRoles = () => {
    try {
        if (!rolesData) {
            const rolesFile = path.join(__dirname, '../config/roles.json');
            const data = fs.readFileSync(rolesFile, 'utf8');
            rolesData = JSON.parse(data).roles;
            logger.info(`Got Roles data from roles.json: ${JSON.stringify(rolesData, null, 3)} @ role_service`)
        }
    } catch (err) {
        // Catch and log the error for further processing by the middleware
        if (err instanceof AppError) {
            logger.error(`AppError encountered: ${err.message} (Code: ${err.code}, Status: ${err.statusCode})`);
            throw err; // If it's already an AppError, throw it
        } else {
            // If it's an unexpected error, wrap it into AppError and log it
            logger.error(`Error loading roles @ role_service: ${err}`);

            throw new AppError('ROLE_LOAD_FAILED', 500, 'Something went wrong with loading roles, please try again later');
        }
    }

    return rolesData;
};

const setRolesData = (roles) => {
    rolesData = roles
}

const getPermissionsByRole = (allRoles, mockLoadRoleCallback = null) => {
    try {
        let roles;
        // use mock callback
        if (mockLoadRoleCallback) {
            roles = mockLoadRoleCallback()
        } else {
            roles = loadRoles();
        }
        console.log(roles);
        logger.trace(`allRoles length: ${allRoles.length}`)
        if (roles) {
            if (allRoles.length > 1) {
                // currently no multiple role support
                // console.log(role);
                logger.warn(`Multiple roles detected: ${JSON.stringify(allRoles, null, 3)} @ role_service`)
                return [];

            } else {
                const role = roles.find((r) => r.name === allRoles[0]);
                logger.info(`Got permission data from single role: ${JSON.stringify(role, null, 3)} @ role_service`)
                return role ? role.permissions : [];
            }
        } else {
            logger.debug("returned []");
            return [];
        }

    } catch (err) {
        // Catch and log the error for further processing by the middleware
        if (err instanceof AppError) {
            logger.error(`AppError encountered: ${err.message} (Code: ${err.code}, Status: ${err.statusCode})`);
            throw err; // If it's already an AppError, throw it
        } else {
            // If it's an unexpected error, wrap it into AppError and log it
            logger.error(`Error getting permissions @ role_service: ${err}`);

            throw new AppError('ROLE_LOAD_FAILED', 500, 'Something went wrong with loading roles, please try again later');
        }
    }

};



module.exports = {
    loadRoles,
    getPermissionsByRole,
    setRolesData,
};