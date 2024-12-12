const jwt = require('jsonwebtoken');
const logger = require("../config/logger")
require('dotenv').config();

const check_scopes = (requiredPermission) => {
    return (req, res, next) => {

        const authHeader = req.headers?.authorization || "";

        if (!authHeader) {
            logger.warn("Attempted access without permission header @ rbac_middleware");
            return res.status(401).send('Access Denied');
        }
        const token = authHeader.split(' ')[1];
        // Get permissions from jwt token
        try {
            const verified = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            console.log(verified);
            const permissions = verified.permissions;
            logger.debug(`Permissions at rbac: ${permissions}`)

            // Check for exact match or wildcard match
            const hasPermission = permissions.some((perm) => {
                if (perm === requiredPermission) return true; // Exact match
                if (perm.endsWith('*')) { // Wildcard match
                    const basePermission = perm.slice(0, -1); // Remove '*' from the end
                    return requiredPermission.startsWith(basePermission);
                }
                return false;
            });

            if (!hasPermission) {
                logger.warn("Attempted access without correct permissions @ rbac_middleware");
                return res.status(403).json({ message: "Access denied: Permission not granted" });
            }
            logger.info(`Correct permissions found: ${requiredPermission}`);
            logger.info(`Proceeding to next stop`);
            next();
        } catch (err) {
            console.log(`err occured ${err}`)
            logger.error(`Error occured: ${err}`)
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = {
    check_scopes
};