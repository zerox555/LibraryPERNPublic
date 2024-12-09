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
            logger.info(`Got Roles data from roles.json: ${JSON.stringify(rolesData)}`)
        }
    } catch (err) {
        logger.error(`Error loading roles in loadRoles function: ${err}`);
    }

    return rolesData;
};

const getPermissionsByRole = (allRoles) => {
    try {
        const roles = loadRoles();
        logger.trace(`allRoles length: ${allRoles.length}`)
        if (roles) {
            if (allRoles.length > 1) {
                //loop multiple times and get all roles
                let role = [];
                for (let i = 0; i < allRoles.length; i++) {
                    const currrentRole = roles.find((r) => r.name === allRoles[i]);
                    // Check if element exists
                    if (role.includes(currrentRole.permissions)) {
                        // Skip
                    } else {
                        role.push(currrentRole.permissions)
                    }
                    logger.warn(`Got permission data from multiple roles: ${JSON.stringify(role)}`)
                }
                return role ? role.permissions : [];

            } else {
                const role = roles.find((r) => r.name === allRoles[0]);
                logger.info(`Got permission data from single role: ${JSON.stringify(role)}`)
                return role ? role.permissions : [];
            }
        } else {
            logger.debug("returned []");
            return [];
        }

    } catch (err) {
        logger.error(`Error getting permissions in getPermissionsByRole: ${err}`);
    }

};

module.exports = {
    loadRoles,
    getPermissionsByRole,
};