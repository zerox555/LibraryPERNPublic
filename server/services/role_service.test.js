const fs = require('fs');
const logger = require("../config/logger")
// const { setRolesData, getPermissionsByRole, loadRoles } = require("./role_service")
const { getPermissionsByRole , loadRoles,setRolesData } = require("./role_service");
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
        const result = getPermissionsByRole(allRoles,dummyAllRoles);

        // expect(loadRoles).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining("Got permission data from single role")
        );
        expect(result).toEqual(["books:*"]);
    });

    // test("should return permissions for multiple roles without duplicates", () => {

    //     const allRoles = ["user", "test"];
    //     const result = getPermissionsByRole(allRoles);

    //     // expect(loadRoles).toHaveBeenCalled();
    //     expect(logger.warn).toHaveBeenCalledWith(
    //         expect.stringContaining("Got permission data from multiple roles")
    //     );
    //     expect(result).toEqual([["books:delete"], ["books:read"]]); // Verify nested permissions array
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

    test("should return empty array for invalid roles", () => {

        const allRoles = ["admind"];
        const result = getPermissionsByRole(allRoles,dummyAllRoles);

        expect(result).toEqual([]);
    });
});

describe("loadRoles function", () => {


    beforeEach(() => {
        // jest.resetAllMocks();
        // jest.clearAllMocks();
        // Reset mocks before each test
    });

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
    test("should return error if failed to load roles", () => {
        //mock retreival
        // fs.readFileSync.mockReturnValue(new Error("Error reading file"));
        fs.readFileSync.mockImplementation(() => { throw new Error("Error reading file"); })

        const dummyReturnedRoles = loadRoles();
        expect(dummyReturnedRoles).toEqual();

        expect(logger.error).toHaveBeenCalledWith("Error loading roles @ role_service: Error: Error reading file");
    })


})

