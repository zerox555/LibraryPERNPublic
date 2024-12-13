class AppError extends Error {
    constructor(code, statusCode, message, frontendSafeCode) {
      super(message);
      this.code = code;
      this.statusCode = statusCode;
      this.frontendSafeCode = frontendSafeCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }

module.exports = AppError;