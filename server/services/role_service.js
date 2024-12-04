const fs = require('fs');
const path = require('path');

let rolesData;

const loadRoles = () => {
    if (!rolesData) {
        const rolesFile = path.join(__dirname, '../config/roles.json');
        const data = fs.readFileSync(rolesFile, 'utf8');
        rolesData = JSON.parse(data).roles;
    }
    return rolesData;
};

const getPermissionsByRole = (allRoles) => {
    const roles = loadRoles();
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
        }
    } else {
        const role = roles.find((r) => r.name === allRoles[0]);
        return role ? role.permissions : [];
    }
};

module.exports = {
    loadRoles,
    getPermissionsByRole,
};