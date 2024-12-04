const jwt = require('jsonwebtoken');


const check_scopes = (requiredPermission) => {
    return (req, res, next) => {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send('Access Denied');
        }
        const token = authHeader.split(' ')[1];
        // Get permissions from jwt token
        try {
            const verified = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            const permissions = verified.permissions;


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
                return res.status(403).json({ message: "Access denied: Permission not granted" });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = {
    check_scopes
};