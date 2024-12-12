const jwt = require('jsonwebtoken');
const logger = require("../config/logger");
const { verify_jwt_token } = require('./auth_middleware');
require('dotenv').config();

jest.mock("../config/logger");
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(), // Ensure verify is a mock function
}));


describe("Verify JWT token function", () => {



    afterEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    const next = jest.fn();

    const res = {
        send: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn()
    };


    // fail if header not present
    test("should fail is header is not present", async () => {
        // request with no header
        const req = {
        };

        const response = await verify_jwt_token(req, res, next);

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access without header @ auth_middleware")
        );
        // Check that res.status was called with 401
        expect(res.status).toHaveBeenCalledWith(401);

        // Check that res.send was called with 'Access Denied'
        expect(res.send).toHaveBeenCalledWith('Access Denied');

        // Ensure next() was not called
        expect(next).not.toHaveBeenCalled();
    })

    // fail if header present but jwt token verify fails
    test("should fail is header present but jwt verify fails", async () => {
        // request with header
        const req = {
            headers: {
                authorization: "Bearer tokenmock"
            }
        };


        jwt.verify.mockImplementationOnce(() => {
            throw new Error('Error');
        });

        const response = await verify_jwt_token(req, res, next);

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access with invalid token @ auth_middleware")
        );
        // Check that res.status was called with 403
        expect(res.status).toHaveBeenCalledWith(403);

        // Check that res.send was called with 'Access Denied'
        expect(res.send).toHaveBeenCalledWith('Invalid Token');

        // Ensure next() was not called
        expect(next).not.toHaveBeenCalled();
    })

    // success if header and jwt present 
    test("should succeed is header present and jwt verify succeeds", async () => {
        // request with header
        const req = {
            headers: {
                authorization: "Bearer tokenmock"
            }
        };


        jwt.verify.mockImplementationOnce(() => {
            return {};
        });

        const response = await verify_jwt_token(req, res, next);

        expect(logger.info.mock.calls[0][0]).toBe(
            "JWT token: tokenmock validated @ auth_middleware"
        );
        expect(logger.info.mock.calls[1][0]).toBe(
            "Proceeding to next stop"
        );

        // Ensure next() was not called
        expect(next).toHaveBeenCalled();
    })
})