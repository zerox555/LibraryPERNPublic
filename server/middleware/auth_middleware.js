const jwt = require('jsonwebtoken');
const logger = require("../config/logger");
const AppError = require("../appError");
require('dotenv').config();

const verify_jwt_token = async (req, res, next) => {
    const authHeader = req.headers?.authorization || "";
    logger.debug(`AuthHeader is: ${authHeader}`);

    if (!authHeader) {
        logger.warn("Attempted access without header @ auth_middleware");
        return next(new AppError('HEADER_MISSING', 400, 'Authorization header is missing.'));
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        logger.warn("No token provided in the authorization header @ auth_middleware");
        return next(new AppError('TOKEN_MISSING', 401, 'Token is missing, authorization denied.'));
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
        logger.info(`JWT token successfully validated @ auth_middleware`);

        // Optionally attach verified payload to request object for further use
        req.user = verified;

        logger.info(`Proceeding to next middleware or route handler`);
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        logger.warn(`Invalid token @ auth_middleware: ${err.message}`);

        if (err.name === 'TokenExpiredError') {
            return next(new AppError('JWT_EXPIRED', 401, 'Token has expired. Please log in again.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new AppError('JWT_INVALID', 401, 'Invalid token provided.'));
        } else {
            // Catch unexpected errors
            logger.error(`Unexpected error @ auth_middleware: ${err.message}`);
            return next(new AppError('INTERNAL_SERVER_ERROR', 500, 'Something went wrong while validating token.'));
        }
    }
};

module.exports = {
    verify_jwt_token
};
