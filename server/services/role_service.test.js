const fs = require('fs');
const logger = require("../config/logger")
// const { setRolesData, getPermissionsByRole, loadRoles } = require("./role_service")
const { getPermissionsByRole, loadRoles, setRolesData } = require("./role_service");
const AppError = require('../appError');
require('dotenv').config();

jest.mock("fs", () => ({
    readFileSync: jest.fn()
}));
jest.mock("../config/logger");
// Mock role_service, including loadRoles
// jest.mock("./role_service", () => {
//     const originalRoleService = jest.requireActual("./role_service");
//     return {
//         ...originalRoleService,  // Keep the original implementation for other methods if needed
//         loadRoles: jest.fn().mockReturnValue([  // Directly mock loadRoles
//             { name: 'admin', permissions: ['books:*'] },
//             { name: 'user', permissions: ['books:read'] },
//             { name: 'test3', permissions: ['books:read', 'books:delete'] }
//         ]),  // Provide mocked roles directly here
//     };
// });



describe("getPermissionsByRole function", () => {

    beforeEach(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const dummyAllRoles = [
        { name: 'admin', permissions: ['books:*'] },
        { name: 'user', permissions: ['books:read'] },
        { name: 'test3', permissions: ['books:read', 'books:delete'] }
    ]

    test("This should log a message", () => {
        console.log("This is a test log");
        expect(true).toBe(true);
    })

    test("should return permissions for a single role", () => {
        // mocked load roles fn
        const allRoles = ["admin"];
        const result = getPermissionsByRole(allRoles, jest.fn().mockReturnValue(dummyAllRoles));

        // expect(loadRoles).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining("Got permission data from single role")
        );
        expect(result).toEqual(["books:*"]);
    });

    test("should return permissions for multiple roles without duplicates", () => {

        const allRoles = ["user", "test"];
        const result = getPermissionsByRole(allRoles, jest.fn().mockReturnValue(dummyAllRoles));


        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("Multiple roles detected: ")
        );
        expect(result).toEqual([]); // Verify nested permissions array
    });

    test("should handle loadRoles failure gracefully", () => {
        const allRoles = ["admin"];
        const mockService = jest.fn().mockImplementation(() => {
            throw new Error("Error loading roles");
        });

        let result;
        let caughtError;

        try {
            result = getPermissionsByRole(allRoles, mockService);
        } catch (err) {
            caughtError = err;
        }

        // Assertions
        expect(caughtError).toBeInstanceOf(AppError); // Verify the error is an instance of AppError
        expect(caughtError.message).toBe("Something went wrong with loading roles, please try again later"); // Validate the error message
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining("Error getting permissions @ role_service")
        ); // Check if the error was logged
        // Ensure no value was returned
        expect(result).toBeUndefined();
    });

    test("should return empty array for invalid roles", () => {

        const allRoles = ["admind"];
        const result = getPermissionsByRole(allRoles, jest.fn().mockReturnValue(dummyAllRoles));

        expect(result).toEqual([]);
    });
});

describe("loadRoles function", () => {

    afterEach(() => {
        setRolesData(undefined); // Reset rolesData for each test
    });

    // load roles success
    test("should load roles from roles.json sucessfully", () => {
        const dummyFileData = JSON.stringify({
            roles: [
                { name: 'admin', permissions: ['books:*'] },
                { name: 'user', permissions: ['books:read'] }
            ]
        });
        //mock retreival
        fs.readFileSync.mockReturnValue(dummyFileData, 'utf8');


        const returnedRoles = loadRoles();

        // expect(js.readFileSync).toHaveBeenCalledWith(rolesFile)
        expect(fs.readFileSync).toHaveReturnedWith(dummyFileData);
        expect(logger.info).toHaveBeenCalled();
        expect(returnedRoles).toEqual(

            [{ name: 'admin', permissions: ['books:*'] },
            { name: 'user', permissions: ['books:read'] }]

        )

    })

    // load roles fail
    test("should return an error if failed to load roles", () => {
        // Mock file reading to simulate an error
        fs.readFileSync.mockImplementation(() => {
            throw new Error("Error reading file");
        });

        // Call the function and handle the error
        let dummyReturnedRoles;
        let caughtError;

        try {
            dummyReturnedRoles = loadRoles();
        } catch (err) {
            caughtError = err;
        }

        // Assertions
        expect(dummyReturnedRoles).toBeUndefined(); // The function should not return a value
        expect(caughtError).toBeInstanceOf(AppError); // Check if the caught error is an instance of AppError
        expect(logger.error).toHaveBeenCalledWith(
            "Error loading roles @ role_service: Error: Error reading file"
        ); // Verify logger error
    });


})

