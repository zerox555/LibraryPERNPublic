const db = require('../models')
const { User } = db
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const { getPermissionsByRole } = require("./role_service");
const logger = require("../config/logger");
const { create_user_post, auth_user } = require('./user_service');
require('dotenv').config();


jest.mock("argon2");
jest.mock("../models", () => ({
    User: {
        create: jest.fn(),
        findOne: jest.fn()
    }
}));
jest.mock("../config/logger");
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()  // Mocking the sign method
}));
jest.mock("./role_service");

describe("create_user_post function", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("should create a user successfully", async () => {
        const dummyUserData = {
            name: "jingen",
            password: "password"
        }
        const dummyHash = "HashedPassword";
        const dummyUser = {
            name: "jingen",
            password: dummyHash,
            roles: ["user"]
        }
        // mock hash fn
        argon2.hash.mockResolvedValue(dummyHash)
        // mock db user creation
        User.create.mockResolvedValue(dummyUser)

        // run create_user_post
        const response = await create_user_post(dummyUserData)

        // check if responses are correct
        expect(argon2.hash).toHaveBeenCalledWith("password")
        expect(User.create).toHaveBeenCalledWith(dummyUser)
        expect(logger.info).toHaveBeenCalled();
        expect(response).toEqual({
            newUser: dummyUser,
            success: true,
            errorMsg: ""
        })
    });

    test("should return error when password hashing fails", async () => {
        const dummyUserData = {
            name: "jingen",
            password: "password"
        }
        // mock hash fn to throw error
        argon2.hash.mockRejectedValue(new Error("Hashing failed"))

        // run create_user_post
        const response = await create_user_post(dummyUserData)

        // check for logger.warn
        expect(logger.warn).toHaveBeenCalled()
        // check for response 
        expect(response).toEqual({
            success: false,
            errorMsg: "Error creating user"
        })
    });

    test("should return error when user creation fails", async () => {
        const dummyUserData = {
            name: "jingen",
            password: "password"
        }
        const dummyHash = "HashedPassword";
        const dummyUser = {
            name: "jingen",
            password: dummyHash,
            roles: ["user"]
        }

        // mock hash fn
        argon2.hash.mockResolvedValue(dummyHash)
        // mock db user creation to throw error
        User.create.mockRejectedValue(new Error("error creating user in db"));

        // run create_user_post
        const response = await create_user_post(dummyUserData)

        expect(argon2.hash).toHaveBeenCalledWith("password")
        expect(User.create).toHaveBeenCalledWith(dummyUser)
        // check for logger.warn
        expect(logger.warn).toHaveBeenCalled()
        // check for response 
        expect(response).toEqual({
            success: false,
            errorMsg: "Error creating user"
        })

    });
});

describe("auth_user function", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });
    // should auth user success
    // cannot find user name
    // fail to create jwt tokens
    // can find user name but error reading user roles


    test("should auth user successfully", async () => {
        const dummyUserData = {
            name: "jingen",
            password: "password",
            id: 1
        }
        const dummyHash = "HashedPassword";
        const dummyFoundUser = {
            name: "jingen",
            password: dummyHash,
            roles: ["user"],
            id: 1
        }
        const dummyUserInfo = {
            id: 1,
            name: "jingen",
            roles: ["user"],
        }

        const dummyPermissions = ["books:read", "books:delete"];
        // mock find user from db
        User.findOne.mockResolvedValue(dummyFoundUser)
        // mock argon2 password check
        argon2.verify.mockResolvedValue(true)
        // mock token creation
        // jwt.sign.mockResolvedValue("randomtokenstring here")
        jwt.sign.mockImplementationOnce(() => "randomtokenstring here");
        // mock permissions getting
        getPermissionsByRole.mockReturnValue(dummyPermissions)

        // call auth_user fn
        const response = await auth_user(dummyUserData);

        expect(User.findOne).toHaveBeenCalledWith({ where: { name: dummyUserData.name } });
        expect(argon2.verify).toHaveBeenCalledWith(dummyFoundUser.password, dummyUserData.password);
        expect(getPermissionsByRole).toHaveBeenCalled();
        expect(getPermissionsByRole).toHaveReturnedWith(["books:read", "books:delete"]);
        expect(jwt.sign).toHaveBeenCalled();
        expect(jwt.sign).toHaveReturnedWith("randomtokenstring here");
        expect(logger.info).toHaveBeenCalledTimes(3);
        expect(logger.info.mock.calls[0][0]).toBe(`User: jingen found in database @ user_service`);
        expect(logger.info.mock.calls[1][0]).toBe(`JWT token signed: randomtokenstring here @ user_service`);
        expect(logger.info.mock.calls[2][0]).toBe(`User logged in: ${JSON.stringify(dummyUserInfo, null, 3)} @ user_service`);
        // expect(logger.warn).toHaveBeenCalledWith("User logged in:");
        expect(response).toEqual({
            success: true,
            data: {
                id: 1,
                name: "jingen",
                roles: ["user"],
                permissions: ["books:read", "books:delete"],
                token: "randomtokenstring here",
                errorMsg: ""
            }
        })

    });

    test("should return error if user is not found", async () => {
        const dummyUserData = {
            name: "jingen",
            password: "password"
        };
        const errorMsg = "Error finding user @ user_service";

        // Mock the database call to simulate user not being found
        User.findOne.mockResolvedValue(null);

        // Call the auth_user function
        const response = await auth_user(dummyUserData);

        // Assert the logger was called for "user not found"
        expect(logger.warn).toHaveBeenCalledWith("User with name: jingen not found in database @ user_service");
        expect(logger.warn).toHaveBeenCalledWith("User not logged in @ user_service");

        // Assert the response contains the error message
        expect(response).toEqual({
            success: false,
            data: {
                errorMsg: errorMsg
            }
        });
    });

    test("should return error if JWT token creation fails", async () => {
        const dummyUserData = {
            name: "jingen",
            password: "password"
        };
        const dummyFoundUser = {
            name: "jingen",
            password: "hashedpassword",
            roles: ["user"]
        };
        const errorMsg = "Error! Something went wrong.";

        // Mock the database call
        User.findOne.mockResolvedValue(dummyFoundUser);
        // Mock password verification
        argon2.verify.mockResolvedValue(true);
        // Mock role permissions
        getPermissionsByRole.mockResolvedValue(["books:read"]);
        // Simulate JWT sign failure
        jwt.sign.mockImplementation(() => { throw new Error("JWT error"); });

        // Call the auth_user function
        const response = await auth_user(dummyUserData);

        // Assert the logger was called for the JWT creation error
        expect(logger.warn).toHaveBeenCalledWith("Error Occured @ user_service: Error: JWT error");

        // Assert the response contains the error message
        expect(response).toEqual({
            success: false,
            data: {
                errorMsg: errorMsg
            }
        });
    });
    test("should return error if user roles cannot be read", async () => {
        const dummyUserData = {
            name: "jingen",
            password: "password"
        };
        const dummyFoundUser = {
            name: "jingen",
            password: "hashedpassword",
            roles: ["user"]
        };
        const errorMsg = "Error loading roles @ user_service: Please contact an admin!";

        // Mock the database call
        User.findOne.mockResolvedValue(dummyFoundUser);
        // Mock password verification
        argon2.verify.mockResolvedValue(true);
        // Simulate failure in reading user roles
        getPermissionsByRole.mockResolvedValue([]); // Empty array means roles can't be read

        jwt.sign.mockImplementationOnce(() => "randomtokenstring here");

        // Call the auth_user function
        const response = await auth_user(dummyUserData);

        expect(getPermissionsByRole).toHaveBeenCalled();

        // Assert the logger was called for the "invalid token and permissions" warning
        expect(logger.warn).toHaveBeenCalledWith("Error occured @ user_service: Invalid token and permissions");

        // Assert the response contains the error message
        expect(response).toEqual({
            success: false,
            data: {
                errorMsg: errorMsg
            }
        });
    });
});