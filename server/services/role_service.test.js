const fs = require('fs');
const logger = require("../config/logger")
const { setRolesData, getPermissionsByRole, loadRoles } = require("./role_service")
const { permission } = require('process');
require('dotenv').config();

jest.mock("fs", () => ({
    readFileSync: jest.fn().mockReturnValue(JSON.stringify({
        roles: [
            { name: 'admin', permissions: ['books:*'] },
            { name: 'user', permissions: ['books:read'] },
            { name: "hehe", permissions: ["books:delete"] }
        ]
    }))
}));
jest.mock("../config/logger");
jest.mock("./role_service", () => ({
    ...jest.requireActual("./role_service"), // Retain other implementations
    loadRoles: jest.fn().mockReturnValue([
        { name: 'admin', permissions: ['*'] },
    ]),
}));

describe("getPermissionsByRole function", () => {

    beforeEach(() => {
    });

    test("This should log a message", () => {
        console.log("This is a test log");
        expect(true).toBe(true);
    })

    test("should return permissions for a single role", () => {
        // // mocked load roles fn
        const allRoles = ["admin"];
        const result = getPermissionsByRole(allRoles);

        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining("Got permission data from single role")
        );
        expect(result).toEqual(["books:*"]);
    });

    // test("should return permissions for multiple roles without duplicates", () => {
    //     const dummyRoles = [
    //         { name: "admin", permissions: ["*"] },
    //         { name: "user", permissions: ["read"] },
    //     ];

    //     loadRoles.mockReturnValue(dummyRoles);

    //     const allRoles = ["admin", "user"];
    //     const result = getPermissionsByRole(allRoles);

    //     expect(loadRoles).toHaveBeenCalled();
    //     expect(logger.warn).toHaveBeenCalledWith(
    //         expect.stringContaining("Got permission data from multiple roles")
    //     );
    //     expect(result).toEqual([["*"], ["read"]]); // Verify nested permissions array
    // });

    // test("should return empty array when no roles found", () => {
    //     loadRoles.mockReturnValue([]);

    //     const allRoles = ["admin"];
    //     const result = getPermissionsByRole(allRoles);

    //     expect(loadRoles).toHaveBeenCalled();
    //     expect(logger.debug).toHaveBeenCalledWith("returned []");
    //     expect(result).toEqual([]);
    // });

    // test("should handle loadRoles failure gracefully", () => {
    //     loadRoles.mockImplementation(() => {
    //         throw new Error("Error loading roles");
    //     });

    //     const allRoles = ["admin"];
    //     const result = getPermissionsByRole(allRoles);

    //     expect(loadRoles).toHaveBeenCalled();
    //     expect(logger.error).toHaveBeenCalledWith(
    //         expect.stringContaining("Error getting permissions @ role_service")
    //     );
    //     expect(result).toBeUndefined(); // Error handling doesn't return a value
    // });

    // test("should return empty array for invalid roles", () => {
    //     const dummyRoles = [
    //         { name: "admin", permissions: ["*"] },
    //         { name: "user", permissions: ["read"] },
    //     ];

    //     loadRoles.mockReturnValue(dummyRoles);

    //     const allRoles = ["nonexistent"];
    //     const result = getPermissionsByRole(allRoles);

    //     expect(loadRoles).toHaveBeenCalled();
    //     expect(logger.debug).toHaveBeenCalledWith("returned []");
    //     expect(result).toEqual([]);
    // });
});

// describe("loadRoles function", () => {


//     beforeEach(() => {
//         // jest.resetAllMocks();
//         // jest.clearAllMocks();
//         // Reset mocks before each test
//     });

//     afterEach(() => {
//         roleService.setRolesData(undefined); // Reset rolesData for each test
//     });

//     // load roles success
//     test("should load roles from roles.json sucessfully", () => {
//         const dummyFileData = JSON.stringify({
//             roles: [
//                 { name: 'admin', permissions: ['books:*'] },
//                 { name: 'user', permissions: ['books:read'] }
//             ]
//         });
//         //mock retreival
//         fs.readFileSync.mockReturnValue(dummyFileData, 'utf8');


//         const returnedRoles = roleService.loadRoles();

//         // expect(js.readFileSync).toHaveBeenCalledWith(rolesFile)
//         expect(fs.readFileSync).toHaveReturnedWith(dummyFileData);
//         expect(logger.info).toHaveBeenCalled();
//         expect(returnedRoles).toEqual(

//             [{ name: 'admin', permissions: ['books:*'] },
//             { name: 'user', permissions: ['books:read'] }]

//         )

//     })

//     // load roles fail
//     test("should return error if failed to load roles", () => {
//         //mock retreival
//         // fs.readFileSync.mockReturnValue(new Error("Error reading file"));
//         fs.readFileSync.mockImplementation(() => { throw new Error("Error reading file"); })

//         const dummyReturnedRoles = roleService.loadRoles();
//         expect(dummyReturnedRoles).toEqual();

//         expect(logger.error).toHaveBeenCalledWith("Error loading roles @ role_service: Error: Error reading file");
//     })


// })

