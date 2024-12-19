const books = require('express').Router()
const db = require('../models')
const { Book } = db
const logger = require("../config/logger")
const AppError = require("../appError")
require('dotenv').config();

// GET ALL BOOKS
const all_book_get = async () => {
    try {
        const foundBooks = await Book.findAll();
        logger.info("Found books from supabase @ books_service");
        console.log("end reached all_book_get");
        console.log(foundBooks);
        const controllerResponse =
        {
            success: true,
            data: foundBooks
        }
        return controllerResponse;
    } catch (err) {
        // Handle error based on type
        if (err instanceof AppError) {
            // If it’s already an AppError, just throw it
            logger.error(`AppError encountered: ${err.message} @ books_service`);
            throw err;
        } else {
            // For unexpected errors, wrap them in an AppError
            logger.error(`Error getting all books @ books_service: ${err}`);
            throw new AppError('BOOK_NOT_FOUND', 500, 'There was a problem getting the books, please try again later');
        }
    }


};

// ADD NEW BOOK
const create_book_post = async ({ name, author, year_published }) => {
    try {
        // validate client input
        if (!(name && author && year_published)) {
            throw new AppError('BOOK_CREATION_FAILED', 400, 'Book details cannot be empty');
        }
        const newBook = await Book.create({
            name,
            author,
            year_published
        }
        );
        logger.info(`Created new book: ${JSON.stringify(newBook)} @ books_service `);
        const controllerResponse =
        {
            success: true,
            data: newBook
        }
        return controllerResponse;
    } catch (err) {
        // Handle error based on type
        if (err instanceof AppError) {
            // If it’s already an AppError, just throw it
            logger.error(`AppError encountered: ${err.message} @ books_service`);
            throw err;
        } else {
            // For unexpected errors, wrap them in an AppError
            logger.error(`Error creating new book @ books_service: ${err}`);
            throw new AppError('BOOK_CREATION_FAILED', 500, 'There was a problem creating book, please try again later');
        }
    }
}

// DELETE A BOOK
const delete_book_post = async (book_id) => {
    try {

        //get book by book id
        const bookSelected = await Book.findOne({ where: { book_id: book_id } })

        if (!bookSelected) {
            logger.warn(`Book with ID: ${book_id} not found @ books_service`);
            throw new AppError('BOOK_DELETION_FAILED', 404, `Book with ID: ${book_id} not found.`);
        }

        if (!book_id) {
            return false
        }
        const deleteStatus = await Book.destroy({
            where: {
                book_id: book_id
            }
        })
        logger.info(`Deleted a book: ${JSON.stringify(bookSelected)} @ books_service `);
        const controllerResponse =
        {
            success: true,
            data: bookSelected
        }
        return controllerResponse;
    }
    catch (err) {
        // Handle error based on type
        if (err instanceof AppError) {
            // If it’s already an AppError, just throw it
            logger.error(`AppError encountered: ${err.message} @ books_service`);
            throw err;
        } else {
            // For unexpected errors, wrap them in an AppError
            logger.error(`Error deleting a book @ books_service: ${err}`);
            throw new AppError('BOOK_DELETION_FAILED', 500, 'There was a problem deleting book, please try again later');
        }
    }
}

// MODIFY A BOOK
const edit_book_post = async ({ name, author, year_published, book_id }) => {
    try {
        logger.info(`year published at service is ${year_published}`)

        // validate client input
        if (!(name && author && year_published)) {
            throw new AppError('BOOK_EDIT_FAILED', 400, 'Book details cannot be empty');
        }

        if (year_published < 0 || year_published > 3000) {
            // Validate year_published
            logger.warn(`Invalid year_published: ${year_published}`);
            throw new AppError('BOOK_EDIT_FAILED', 400, 'Year cannot be less than 0 or greater than 3000');
        }
        const oldBook = { name, author, year_published };
        //get book by book id
        const bookSelected = await Book.findOne({ where: { book_id: book_id } })
        if (!bookSelected) {
            throw new AppError('BOOK_EDIT_FAILED', 404, `Book with ID: ${book_id} not found.`);
        }
        //change fields
        bookSelected.name = name;
        bookSelected.author = author;
        bookSelected.year_published = year_published;
        //write it back to db
        const editStatus = await bookSelected.save();
        logger.info(`Edited a book: ${JSON.stringify(oldBook)} -> ${JSON.stringify(bookSelected)} @ books_service `);
        const controllerResponse =
        {
            success: true,
            data: editStatus
        }
        return controllerResponse
    } catch (err) {
        // Handle error based on type
        if (err instanceof AppError) {
            // If it’s already an AppError, just throw it
            logger.error(`AppError encountered: ${err.message} @ books_service`);
            throw err;
        } else {
            // For unexpected errors, wrap them in an AppError
            logger.error(`Unexpected error editing a book @ books_service: ${err.message}`);
            throw new AppError('BOOK_EDIT_FAILED', 500, 'There was a problem editing the book, please try again later');
        }
    }
}


module.exports = {
    all_book_get,
    create_book_post,
    delete_book_post,
    edit_book_post
}