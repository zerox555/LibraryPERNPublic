const {
    create_user_post_controller,
    auth_user_controller,
} = require("../controllers/user_controller");
const { create_user_post, auth_user } = require("../services/user_service");
const logger = require("../config/logger");

jest.mock("../services/user_service");
jest.mock("../config/logger");

describe("User Controller Tests", () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe("create_user_post_controller", () => {
        it("should create a new user successfully", async () => {
            const mockNewUser = { id: 1, name: "testUser" };
            create_user_post.mockResolvedValue(mockNewUser);

            mockReq.body = { name: "testUser", password: "password123" };
            await create_user_post_controller(mockReq, mockRes);

            expect(create_user_post).toHaveBeenCalledWith({
                name: "testUser",
                password: "password123",
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(mockNewUser);
            expect(logger.info).toHaveBeenCalledWith(
                "New User creation completed @ user_controller"
            );
        });

        it("should handle user creation failure", async () => {
            const mockNewUser = { errorMsg: "User creation failed" };
            create_user_post.mockResolvedValue(mockNewUser);

            mockReq.body = { name: "testUser", password: "password123" };
            await create_user_post_controller(mockReq, mockRes);

            expect(create_user_post).toHaveBeenCalledWith({
                name: "testUser",
                password: "password123",
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(mockNewUser);
            expect(logger.info).toHaveBeenCalledWith(
                "New User creation failed @ user_controller"
            );
        });

        it("should handle server errors gracefully", async () => {
            create_user_post.mockRejectedValue(new Error("Database error"));

            mockReq.body = { name: "testUser", password: "password123" };
            await create_user_post_controller(mockReq, mockRes);

            expect(create_user_post).toHaveBeenCalledWith({
                name: "testUser",
                password: "password123",
            });
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Server error");
            expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("auth_user_controller", () => {
        it("should authenticate user successfully", async () => {
            const mockValidUser = { data: { id: 1, name: "testUser" } };
            auth_user.mockResolvedValue(mockValidUser);

            mockReq.body = { name: "testUser", password: "password123" };
            await auth_user_controller(mockReq, mockRes);

            expect(auth_user).toHaveBeenCalledWith({
                name: "testUser",
                password: "password123",
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockValidUser);
            expect(logger.info).toHaveBeenCalledWith(
                "User authentication completed @ user_controller"
            );
        });

        it("should handle authentication failure", async () => {
            const mockValidUser = { data: { errorMsg: "Invalid credentials" } };
            auth_user.mockResolvedValue(mockValidUser);

            mockReq.body = { name: "testUser", password: "wrongPassword" };
            await auth_user_controller(mockReq, mockRes);

            expect(auth_user).toHaveBeenCalledWith({
                name: "testUser",
                password: "wrongPassword",
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockValidUser);
            expect(logger.info).toHaveBeenCalledWith(
                "User authentication failed @ user_controller"
            );
        });

        it("should handle server errors gracefully", async () => {
            auth_user.mockRejectedValue(new Error("Database error"));

            mockReq.body = { name: "testUser", password: "password123" };
            await auth_user_controller(mockReq, mockRes);

            expect(auth_user).toHaveBeenCalledWith({
                name: "testUser",
                password: "password123",
            });
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Server error");
            expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
