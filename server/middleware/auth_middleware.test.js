const jwt = require('jsonwebtoken');
const logger = require("../config/logger");
const { verify_jwt_token } = require('./auth_middleware');
require('dotenv').config();

jest.mock("../config/logger");
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe("verify_jwt_token function", () => {
    let next, res;

    beforeEach(() => {
        next = jest.fn();
        res = {
            send: jest.fn(),
            status: jest.fn(() => res),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("should fail if header is not present", async () => {
        const req = {};

        await verify_jwt_token(req, res, next);

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access without header @ auth_middleware")
        );
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Access Denied");
        expect(next).not.toHaveBeenCalled();
    });

    test("should fail if jwt.verify throws an error", async () => {
        const req = {
            headers: {
                authorization: "Bearer tokenmock"
            }
        };

        jwt.verify.mockImplementationOnce(() => {
            throw new Error('Error');
        });

        await verify_jwt_token(req, res, next);

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access with invalid token @ auth_middleware")
        );
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Invalid Token");
        expect(next).not.toHaveBeenCalled();
    });

    test("should succeed if jwt.verify validates the token", async () => {
        const req = {
            headers: {
                authorization: "Bearer tokenmock"
            }
        };

        jwt.verify.mockImplementationOnce(() => ({}));

        await verify_jwt_token(req, res, next);

        expect(logger.info).toHaveBeenCalledWith(
            "JWT token: tokenmock validated @ auth_middleware"
        );
        expect(logger.info).toHaveBeenCalledWith(
            "Proceeding to next stop"
        );
        expect(next).toHaveBeenCalled();
    });
});
