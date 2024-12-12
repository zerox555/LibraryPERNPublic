const jwt = require('jsonwebtoken');
const logger = require("../config/logger");
const { check_scopes } = require('./rbac_middleware');
require('dotenv').config();

jest.mock("../config/logger");
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe("check_scopes function", () => {
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

    test("should fail if no header", () => {
        const req = {};
        const middleware = check_scopes("books:read");

        middleware(req, res, next);

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access without permission header @ rbac_middleware")
        );
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Access Denied");
        expect(next).not.toHaveBeenCalled();
    });

    test("should fail if no authorization header", () => {
        const req = { headers: {} };
        const middleware = check_scopes("books:read");

        middleware(req, res, next);

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access without permission header @ rbac_middleware")
        );
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Access Denied");
        expect(next).not.toHaveBeenCalled();
    });

    test("should fail if jwt.verify fails", () => {
        const req = { headers: { authorization: "Bearer invalidtoken" } };
        jwt.verify.mockImplementationOnce(() => {
            throw new Error("Error");
        });
        const middleware = check_scopes("books:read");

        middleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining("Error occured:")
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        expect(next).not.toHaveBeenCalled();
    });

    test("should fail if user lacks permission", () => {
        const req = { headers: { authorization: "Bearer validtoken" } };
        jwt.verify.mockReturnValueOnce({ permissions: ["books:read"] });
        const middleware = check_scopes("books:write");

        middleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(logger.debug).toHaveBeenCalledWith(
            expect.stringContaining("Permissions at rbac:")
        );
        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access without correct permissions @ rbac_middleware")
        );
        expect(res.json).toHaveBeenCalledWith({ message: "Access denied: Permission not granted" });
        expect(next).not.toHaveBeenCalled();
    });

    test("should succeed if user has specific permission", () => {
        const req = { headers: { authorization: "Bearer validtoken" } };
        jwt.verify.mockReturnValueOnce({ permissions: ["books:read"] });
        const middleware = check_scopes("books:read");

        middleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(logger.debug).toHaveBeenCalledWith(
            expect.stringContaining("Permissions at rbac:")
        );
        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining("Correct permissions found:")
        );
        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining("Proceeding to next stop")
        );
        expect(next).toHaveBeenCalled();
    });

    test("should succeed if user has wildcard permission", () => {
        const req = { headers: { authorization: "Bearer validtoken" } };
        jwt.verify.mockReturnValueOnce({ permissions: ["books:*"] });
        const middleware = check_scopes("books:read");

        middleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(logger.debug).toHaveBeenCalledWith(
            expect.stringContaining("Permissions at rbac:")
        );
        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining("Correct permissions found:")
        );
        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining("Proceeding to next stop")
        );
        expect(next).toHaveBeenCalled();
    });
});
