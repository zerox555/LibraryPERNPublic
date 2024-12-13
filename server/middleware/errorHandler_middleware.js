const logger = require("../config/logger")
const AppError = require("../appError")
require('dotenv').config();


const ERROR_CODE_MAP = {
    CONTROLLER_ERROR: "INTERNAL_SERVER_ERROR",
    DATABASE_ERROR: "INTERNAL_SERVER_ERROR",
    INVALID_INPUT: "VALIDATION_ERROR",
    AUTH_FAILED: "AUTHENTICATION_FAILED",
    UNKNOWN_ERROR: "INTERNAL_SERVER_ERROR",
};

const handle_errors = async (err, req, res, next) => {
    // Check if the error is an instance of AppError
    const isKnownError = err instanceof AppError;

    // Extract details from the error or use defaults for unexpected errors
    const debugCode = isKnownError ? err.debugCode : "UNKNOWN_ERROR";
    const clientCode = isKnownError ? err.clientCode : "INTERNAL_SERVER_ERROR";
    const statusCode = err.statusCode || 500;
    const message = isKnownError ? err.message : "An unexpected error occurred";

    // Log the error for debugging
    logger.error(`[${debugCode}]`, err.stack || err);

    // Send a client-safe error response
    res.status(statusCode).json({
        success: "error",
        code: clientCode,
        message,
    });
}

module.exports = {
    handle_errors
}