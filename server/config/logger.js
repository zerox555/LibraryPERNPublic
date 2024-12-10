const pino = require('pino');
require('dotenv').config();

// Define environment-specific configurations
const devConfig = {
    level: 'trace',
    transport: {
        target: 'pino-pretty', // Use pino-pretty for development
        options: {
            colorize: true, // Enable colorized output
            translateTime: true, // Show timestamps
            singleLine: false,
            messageFormat: false,
        }
    }
};

const prodConfig = {
    level: 'info', // Log only 'info' and higher (e.g., 'warn', 'error') in production
};

// Choose configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
const logger = pino(isProduction ? prodConfig : devConfig);

logger.info({ key: 'value', message: 'This is a test log' });

// Export the logger instance
module.exports = logger;