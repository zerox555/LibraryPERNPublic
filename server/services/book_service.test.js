const { Book } = require('../models');
const { all_book_get, create_book_post, delete_book_post, edit_book_post } = require('./book_service');
const logger = require("../config/logger");

// Mock the Book model
jest.mock('../models');
jest.mock("../config/logger");

describe("Books Service", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  // Test for all_book_get function
  describe("GET all books", () => {
    it("should return all books", async () => {
      // Mock the Book.findAll method to return a sample array of books
      const mockBooks = [
        { book_id: 1, name: 'Test Book 1', author: 'Author 1', year_published: 2020 },
        { book_id: 2, name: 'Test Book 2', author: 'Author 2', year_published: 2021 }
      ];
      Book.findAll.mockResolvedValue(mockBooks);

      const books = await all_book_get();
      
      expect(books).toEqual(mockBooks);
      expect(logger.info).toHaveBeenCalledWith("Found books from supabase @ books_service");
    });

    it("should handle errors when fetching books", async () => {
      const mockError = new Error("Database error");
      Book.findAll.mockRejectedValue(mockError);

      try {
        await all_book_get();
      } catch (err) {
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error getting all books"));
      }
    });
  });

  // Test for create_book_post function
  describe("POST create book", () => {
    it("should create a new book", async () => {
      const newBookData = { name: "New Book", author: "New Author", year_published: 2023 };
      const newBook = { ...newBookData, book_id: 3 };

      // Mock the Book.create method
      Book.create.mockResolvedValue(newBook);

      const createdBook = await create_book_post(newBookData);
      
      expect(createdBook).toEqual(newBook);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("Created new book"));
    });

    it("should handle errors when creating a book", async () => {
      const newBookData = { name: "New Book", author: "New Author", year_published: 2023 };
      const mockError = new Error("Create error");

      Book.create.mockRejectedValue(mockError);

      try {
        await create_book_post(newBookData);
      } catch (err) {
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error creating new book"));
      }
    });
  });

  // Test for delete_book_post function
  describe("POST delete book", () => {
    it("should delete a book", async () => {
      const bookId = 1;
      const deletedBook = { book_id: 1, name: 'Test Book', author: 'Test Author', year_published: 2020 };

      // Mock Book.findOne and Book.destroy methods
      Book.findOne.mockResolvedValue(deletedBook);
      Book.destroy.mockResolvedValue(1);

      const status = await delete_book_post(bookId);

      expect(status).toBe(1);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("Deleted a book"));
    });

    it("should handle errors when deleting a book", async () => {
      const bookId = 1;
      const mockError = new Error("Delete error");

      Book.findOne.mockResolvedValue(null);
      Book.destroy.mockRejectedValue(mockError);

      try {
        await delete_book_post(bookId);
      } catch (err) {
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error deleting a book"));
      }
    });
  });

  // Test for edit_book_post function
  describe("POST edit book", () => {
    it("should update an existing book", async () => {
      const bookId = 1;
      const bookData = { name: "Updated Book", author: "Updated Author", year_published: 2023 };
      const updatedBook = { ...bookData, book_id: bookId };

      // Mock Book.findOne and Book.save methods
      Book.findOne.mockResolvedValue({ book_id: bookId, ...bookData, save: jest.fn().mockResolvedValue(updatedBook) });

      const result = await edit_book_post({ ...bookData, book_id: bookId });

      expect(result).toEqual(updatedBook);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("Edited a book"));
    });

    it("should handle errors when editing a book", async () => {
      const mockError = new Error("Edit error");
      const bookId = 1;
      const bookData = { name: "Updated Book", author: "Updated Author", year_published: 2023 };

      Book.findOne.mockRejectedValue(mockError);

      try {
        await edit_book_post({ ...bookData, book_id: bookId });
      } catch (err) {
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error editing a book"));
      }
    });
  });
});
