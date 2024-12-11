const fs = require('fs');
const path = require('path');
const logger = require("../config/logger")
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
        logger.error(`Error loading roles @ role_service: ${err}`);
    }

    return rolesData;
};

const setRolesData = (roles) => {
    rolesData = roles
}

const getPermissionsByRole = (allRoles) => {
    try {
        const roles = loadRoles();
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
            console.log("Debug reached");
            logger.debug("returned []");
            return [];
        }

    } catch (err) {
        logger.error(`Error getting permissions @ role_service: ${err}`);
    }

};

module.exports = {
    loadRoles,
    getPermissionsByRole,
    setRolesData
};