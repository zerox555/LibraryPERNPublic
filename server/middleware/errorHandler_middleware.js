const logger = require("../config/logger")
const AppError = require("../appError")
require('dotenv').config();


const handle_errors = async (err, req, res, next) => {
    // Check if the error is an instance of AppError
    const isKnownError = err instanceof AppError;

    // Extract details from the error or use defaults for unexpected errors
    const errorCode = isKnownError ? err.errorCode : "UNKNOWN_ERROR";
    const statusCode = err.statusCode || 500;
    const message = isKnownError ? err.message : "An unexpected error occurred";

    // Log the error for debugging
    logger.error(`[${errorCode}]`, err.stack || err);

    // Send a client-safe error response
    res.status(statusCode).json({
        success: false,
        error: {
            errorCode: errorCode,
            message: message,
            httpStatus: statusCode
        }
    });
}

module.exports = {
    handle_errors
}