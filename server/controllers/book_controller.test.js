const {
    all_book_get_controller,
    create_book_post_controller,
    delete_book_post_controller,
    edit_book_post_controller,
} = require("../controllers/book_controller");

const {
    all_book_get,
    create_book_post,
    delete_book_post,
    edit_book_post,
} = require("../services/book_service");

const logger = require("../config/logger");

jest.mock("../services/book_service");
jest.mock("../config/logger");

describe("Book Controller Tests", () => {
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

    describe("all_book_get_controller", () => {
        it("should return all books successfully", async () => {
            const mockBooks = [{ id: 1, name: "Book 1" }, { id: 2, name: "Book 2" }];
            all_book_get.mockResolvedValue(mockBooks);

            await all_book_get_controller(mockReq, mockRes);

            expect(all_book_get).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockBooks);
            expect(logger.info).toHaveBeenCalledWith(
                "Find all books transaction done @ book_controller"
            );
        });

        it("should handle server errors", async () => {
            all_book_get.mockRejectedValue(new Error("Database error"));

            await all_book_get_controller(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Server error");
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error occured @ book_controller"));
        });
    });

    describe("create_book_post_controller", () => {
        it("should create a new book successfully", async () => {
            const mockBook = { id: 1, name: "New Book", author: "Author 1" };
            create_book_post.mockResolvedValue(mockBook);

            mockReq.body = { name: "New Book", author: "Author 1", year_published: 2023 };
            await create_book_post_controller(mockReq, mockRes);

            expect(create_book_post).toHaveBeenCalledWith({
                name: "New Book",
                author: "Author 1",
                year_published: 2023,
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockBook);
            expect(logger.info).toHaveBeenCalledWith(
                "Create book transaction done @ book_controller"
            );
        });

        it("should handle server errors", async () => {
            create_book_post.mockRejectedValue(new Error("Database error"));

            mockReq.body = { name: "New Book", author: "Author 1", year_published: 2023 };
            await create_book_post_controller(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Server error");
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error occured @ book_controller"));
        });
    });

    describe("delete_book_post_controller", () => {
        it("should delete a book successfully", async () => {
            const mockDeleteStatus = { success: true };
            delete_book_post.mockResolvedValue(mockDeleteStatus);

            mockReq.body = { book_id: 1 };
            await delete_book_post_controller(mockReq, mockRes);

            expect(delete_book_post).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockDeleteStatus);
            expect(logger.info).toHaveBeenCalledWith(
                "Delete book transaction done @ book_controller"
            );
        });

        it("should return 400 if book_id is missing", async () => {
            mockReq.body = {};
            await delete_book_post_controller(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Book ID is required",
            });
        });

        it("should handle server errors", async () => {
            delete_book_post.mockRejectedValue(new Error("Database error"));

            mockReq.body = { book_id: 1 };
            await delete_book_post_controller(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Server error");
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error occured @ book_controller"));
        });
    });

    describe("edit_book_post_controller", () => {
        it("should edit a book successfully", async () => {
            const mockEditStatus = { success: true };
            edit_book_post.mockResolvedValue(mockEditStatus);

            mockReq.body = {
                book_id: 1,
                name: "Updated Book",
                author: "Updated Author",
                year_published: 2023,
            };
            await edit_book_post_controller(mockReq, mockRes);

            expect(edit_book_post).toHaveBeenCalledWith({
                book_id: 1,
                name: "Updated Book",
                author: "Updated Author",
                year_published: 2023,
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockEditStatus);
            expect(logger.info).toHaveBeenCalledWith(
                "Edit book transaction done @ book_controller"
            );
        });

        it("should handle server errors", async () => {
            edit_book_post.mockRejectedValue(new Error("Database error"));

            mockReq.body = {
                book_id: 1,
                name: "Updated Book",
                author: "Updated Author",
                year_published: 2023,
            };
            await edit_book_post_controller(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Server error");
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error occured @ book_controller"));
        });
    });
});
