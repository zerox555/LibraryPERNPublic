const jwt = require('jsonwebtoken');
const { check_scopes } = require('./rbac_middleware');
const logger = require('../config/logger');
const AppError = require('../appError');

// Mocking the logger to prevent actual log calls during tests
jest.mock('../config/logger', () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mocking jsonwebtoken module
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
    JsonWebTokenError: jest.fn().mockReturnValue({
        name: 'JsonWebTokenError',
    }),
    TokenExpiredError: jest.fn().mockReturnValue({
        name: 'TokenExpiredError',
    }),
}));

describe('check_scopes Middleware', () => {
    let req, res, next;
    const secretKey = process.env.REACT_APP_JWT_SECRET || 'test-secret-key';

    beforeEach(() => {
        req = { headers: {} };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should return HEADER_MISSING error when Authorization header is absent', async () => {
        await check_scopes('books:read')(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                errorCode: 'HEADER_MISSING',
                statusCode: 400,
                message: 'Cannot access at this time, please try again later',
            })
        );
    });

    it('should return INVALID_TOKEN error when jwt.verify throws JsonWebTokenError', async () => {
        req.headers.authorization = 'Bearer invalidToken';

        // Mock jwt.verify to throw JsonWebTokenError
        jwt.verify.mockImplementation(() => {
            throw new jwt.JsonWebTokenError('invalid signature');
        });

        await check_scopes('books:read')(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                errorCode: 'INVALID_TOKEN',
                statusCode: 401,
                message: 'Invalid token provided',
            })
        );
    });

    it('should return INSUFFICIENT_PERMISSIONS error when permissions do not match', async () => {
         // mock user has read permissions on books
         jwt.verify.mockImplementationOnce(() => {
            return {
                permissions: [
                    "books:read"
                ]
            };
        });
        req.headers.authorization = `Bearer mocktoken`;

        await check_scopes('books:write')(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                errorCode: 'INSUFFICIENT_PERMISSIONS',
                statusCode: 403,
                message: 'Cannot access at this time, please try again later',
            })
        );
    });

    it('should call next with user payload when user has correct permissions', async () => {
        // mock user has read permissions on books
        jwt.verify.mockImplementationOnce(() => {
            return {
                permissions: [
                    "books:read"
                ]
            };
        });
        req.headers.authorization = `Bearer mockToken`;

        await check_scopes('books:read')(req, res, next);

        // Expect next() to be called without error
        expect(next).toHaveBeenCalledWith();  // Proceed to the next middleware
    });

    it('should handle unexpected errors and return INTERNAL_SERVER_ERROR', async () => {
        req.headers.authorization = 'Bearer validToken';  // Valid token

        // Mock jwt.verify to throw an unexpected error
        jwt.verify.mockImplementation(() => {
            throw new Error('Unexpected Error');
        });

        await check_scopes('books:read')(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                errorCode: 'INTERNAL_SERVER_ERROR',
                statusCode: 500,
                message: 'Something went wrong, please try again later',
            })
        );
    });

    it('should handle missing required permissions with wildcard match', async () => {
        // mock user has wildcard permissions on books
        jwt.verify.mockImplementationOnce(() => {
            return {
                permissions: [
                    "books:*"
                ]
            };
        });
        req.headers.authorization = `Bearer mockToken`;

        // check if user has read permission on books
        await check_scopes('books:read')(req, res, next);

        expect(next).toHaveBeenCalledWith();  // User has 'read:' permission, so next should be called
    });
});
