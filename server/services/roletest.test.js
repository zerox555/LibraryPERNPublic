const logger = require("../config/logger")
// const { loadRoles, getPermissionsByRole } = require("./role_service")
const roleService =require("./role_service") 
require('dotenv').config();

// jest.mock("fs", () => {
//     {
//         readFileSync: jest.fn().mockReturnValue("No using FS")
//     }
// });

jest.mock('./role_service', () => (
    {
        // getPermissionsByRole: jest.requireActual('./role_service').getPermissionsByRole,
        ...jest.requireActual('./role_service'),
        loadRoles: jest.fn().mockReturnValue("Ignored fs"),
    }));

describe("load roles function", () => {

    beforeEach(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("loadRoles without giving a shit about fs", () => {
        // mocked load roles fn
        const response = roleService.loadRoles();

        expect(response).toEqual("Ignored fs")
    });

    test("use loadRoles without giving a shit about fs", () => {
        // mocked load roles fn
        const response = roleService.testing();

        // expect(roleService.loadRoles).toHaveBeenCalled();
        expect(response).toBe("Ignored fs")
    });



});