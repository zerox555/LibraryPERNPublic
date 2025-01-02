const jwt = require('jsonwebtoken');
const { verify_jwt_token } = require('./auth_middleware');
const logger = require('../config/logger');
const AppError = require('../appError');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
    JsonWebTokenError: jest.fn().mockReturnValue({
        name:"JsonWebTokenError"
    }),
    TokenExpiredError: jest.fn().mockReturnValue({
        name:"TokenExpiredError"
    }),
}));

jest.mock('../config/logger', () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

describe('verify_jwt_token Middleware', () => {
    const req = {};
    const res = {};
    let next;

    beforeEach(() => {
        req.headers = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        next = jest.fn();

        jest.clearAllMocks();
    });

    it('should return HEADER_MISSING error when Authorization header is absent', async () => {
        await verify_jwt_token(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                errorCode: 'HEADER_MISSING',
                statusCode: 400,
                message: 'Authorization header is missing.',
            })
        );
    });

    it('should return TOKEN_MISSING error when token is missing in Authorization header', async () => {
        req.headers.authorization = 'Bearer '; // Empty token
        await verify_jwt_token(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                errorCode: 'TOKEN_MISSING',
                statusCode: 401,
                message: 'Token is missing, authorization denied.',
            })
        );
    });

    it('should return JWT_INVALID error when jwt.verify throws JsonWebTokenError', async () => {
        req.headers.authorization = 'Bearer invalidToken123';

        // Mock jwt.verify to throw JsonWebTokenError
        jwt.verify.mockImplementation(() => {
            throw new jwt.JsonWebTokenError('invalid signature');
        });

        await verify_jwt_token(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                errorCode: 'JWT_INVALID',
                statusCode: 401,
                message: 'Invalid token provided.',
            })
        );
    });

    it('should return JWT_EXPIRED error when jwt.verify throws TokenExpiredError', async () => {
        req.headers.authorization = 'Bearer expiredToken';

        // Mock jwt.verify to throw TokenExpiredError
        jwt.verify.mockImplementation(() => {
            throw new jwt.TokenExpiredError('jwt expired', new Date());
        });

        await verify_jwt_token(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                errorCode: 'JWT_EXPIRED',
                statusCode: 401,
                message: 'Token has expired. Please log in again.',
            })
        );
    });

    it('should call next with user payload when jwt.verify succeeds', async () => {
        req.headers.authorization = 'Bearer validToken';
        const mockPayload = { id: 123, email: 'test@example.com' };

        // Mock jwt.verify to return the payload
        jwt.verify.mockReturnValue(mockPayload);

        await verify_jwt_token(req, res, next);

        // expect(req.user).toEqual(mockPayload);
        expect(next).toHaveBeenCalledWith(); // No error passed to next
    });
});
