const jwt = require('jsonwebtoken');
const logger = require("../config/logger");
const AppError = require("../appError");
require('dotenv').config();

const check_scopes = (requiredPermission) => {
    return (req, res, next) => {
        const authHeader = req.headers?.authorization || "";

        if (!authHeader) {
            logger.warn("Attempted access without permission header @ rbac_middleware");
            return next(new AppError('HEADER_MISSING', 400, 'Cannot access at this time, please try again later'));
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify JWT token
            const verified = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            const permissions = verified.permissions;
            logger.debug(`Permissions at rbac: ${permissions}`);

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
                return next(new AppError('INSUFFICIENT_PERMISSIONS', 403, 'Cannot access at this time, please try again later'));
            }

            logger.info(`Correct permissions found: ${requiredPermission}`);
            logger.info(`Proceeding to next stop`);
            next();
        } catch (err) {
            console.log(err.name);
            if (err.name == "JsonWebTokenError") {
                // Handle JWT-specific errors
                logger.error(`JWT verification error @ rbac_middleware: ${err.message}`);
                return next(new AppError('INVALID_TOKEN', 401, 'Invalid token provided'));
            }

            logger.error(`Error occurred @ rbac_middleware: ${err.message}`);
            // Pass unexpected or AppErrors to error-handling middleware
            next(err instanceof AppError ? err : new AppError('INTERNAL_SERVER_ERROR', 500, 'Something went wrong, please try again later'));
        }
    };
};

module.exports = {
    check_scopes
};
