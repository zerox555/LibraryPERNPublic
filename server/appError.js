class AppError extends Error {
    constructor(errorCode, statusCode, message) {
      super(message);
      this.errorCode = errorCode;
      this.statusCode = statusCode;
      // this.frontendSafeCode = frontendSafeCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }

module.exports = AppError;