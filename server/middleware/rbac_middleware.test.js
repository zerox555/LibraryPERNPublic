const jwt = require('jsonwebtoken');
const logger = require("../config/logger");
const { check_scopes } = require('./rbac_middleware');
require('dotenv').config();

jest.mock("../config/logger");
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(), // Ensure verify is a mock function
}));

describe("check scopes function", () => {
    // Need to find a way to mock req,res,next params


    afterEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    const mockNext = () => {
        const next = jest.fn();
        return next;
    };

    const next = jest.fn();

    const res = {
        send: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn()
    };


    // no header fail
    test("should fail if no header", () => {
        const req = {};

        const dummyRequiredPermission = "books:read";
        const check_scopes_func = check_scopes(dummyRequiredPermission);

        check_scopes_func(req, res, mockNext)

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access without permission header @ rbac_middleware")
        );
        expect(res.status).toHaveBeenCalled();
    })
    // no auth header fail
    test("should fail if no authorization header", () => {
        const req = {
            header: {

            }
        };

        const dummyRequiredPermission = "books:read";
        const check_scopes_func = check_scopes(dummyRequiredPermission);

        check_scopes_func(req, res, mockNext)

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access without permission header @ rbac_middleware")
        );
        expect(res.status).toHaveBeenCalled();
    })

    // jwt verify fail
    test("should fail if jwt verify fails", () => {
        const req = {
            headers: {
                authorization: "Bearer dsfjhaofosfod"
            }
        }

        jwt.verify.mockImplementationOnce(() => {
            return {};
        });

        const dummyRequiredPermission = "books:read";
        const check_scopes_func = check_scopes(dummyRequiredPermission);

        check_scopes_func(req, res, mockNext)

        expect(jwt.verify).toHaveBeenCalled();

        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining("Error occured:")
        );
        expect(res.status).toHaveBeenCalled();
    })

    // jwt returns error fail
    test("should fail if jwt verify returns error", () => {
        const req = {
            headers: {
                authorization: "Bearer dsfjhaofosfod"
            }
        }

        jwt.verify.mockImplementationOnce(() => {
            return (new Error("error"));
        });

        const dummyRequiredPermission = "books:read";
        const check_scopes_func = check_scopes(dummyRequiredPermission);

        check_scopes_func(req, res, mockNext)

        expect(jwt.verify).toHaveBeenCalled();

        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining("Error occured:")
        );
        expect(res.status).toHaveBeenCalled();
    })

    // has specifc permission success
    test("should show success if user has specific permission", () => {
        const req = {
            headers: {
                authorization: "Bearer dsfjhaofosfod"
            }
        }

        jwt.verify.mockImplementationOnce(() => {
            return {
                permissions: [
                    "books:read"
                ]
            }
        }
        );
        const dummyRequiredPermission = "books:read";
        const check_scopes_func = check_scopes(dummyRequiredPermission);

        check_scopes_func(req, res, next)

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
    })

    // has * wildcard success
    test("should show success if user has wildcard permission", () => {
        const req = {
            headers: {
                authorization: "Bearer dsfjhaofosfod"
            }
        }

        jwt.verify.mockImplementationOnce(() => {
            return {
                permissions: [
                    "books:*"
                ]
            }
        }
        );
        const dummyRequiredPermission = "books:read";
        const check_scopes_func = check_scopes(dummyRequiredPermission);

        check_scopes_func(req, res, next)

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
    })

    // does not have permission fail
    test("should fail if user does not have permission", () => {
        const req = {
            headers: {
                authorization: "Bearer dsfjhaofosfod"
            }
        }

        jwt.verify.mockImplementationOnce(() => {
            return {
                permissions: [
                    "books:read"
                ]
            }
        }
        );
        const dummyRequiredPermission = "books:write";
        const check_scopes_func = check_scopes(dummyRequiredPermission);

        check_scopes_func(req, res, next)

        expect(jwt.verify).toHaveBeenCalled();

        expect(logger.debug).toHaveBeenCalledWith(
            expect.stringContaining("Permissions at rbac:")
        );

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Attempted access without correct permissions @ rbac_middleware")
        );

        expect(res.json).toHaveBeenCalledWith({ message: "Access denied: Permission not granted" });
    })
})