const books = require('express').Router()
const db = require('../models')
const { Book } = db
const logger = require("../config/logger")
require('dotenv').config();

// GET ALL BOOKS
const all_book_get = async () => {
    try {
        const foundBooks = await Book.findAll();
        logger.info("Found books from supabase!");
        return foundBooks;
    } catch (err) {
        res.status(500).send("Server error");
        logger.error(`Error getting all books in books_service: ${err}`);
        throw err;
    }
};

// ADD NEW BOOK
const create_book_post = async ({ name, author, year_published }) => {
    try {
        const newBook = await Book.create({
            name,
            author,
            year_published
        }
        );
        logger.info(`Created new book: ${JSON.stringify(newBook)}`);
        return newBook;
    } catch (err) {
        logger.error(`Error creating new book in books_service: ${err}`);
        throw err;
    }
}

// DELETE A BOOK
const delete_book_post = async (book_id) => {
    try {

        //get book by book id
        const bookSelected = await Book.findOne({ where: { book_id: book_id } })

        if (!book_id) {
            return false
        }
        const deleteStatus = await Book.destroy({
            where: {
                book_id: book_id
            }
        })
        logger.info(`Deleted a book: ${JSON.stringify(bookSelected)}`);
        return deleteStatus;
    } catch (err) {
        logger.error(`Error deleting a book in books_service: ${err}`);
        throw err;
    }
}

// MODIFY A BOOK
const edit_book_post = async ({ name, author, year_published, book_id }) => {
    try {
        const oldBook = { name, author, year_published };
        //get book by book id
        const bookSelected = await Book.findOne({ where: { book_id: book_id } })
        //change fields
        bookSelected.name = name;
        bookSelected.author = author;
        bookSelected.year_published = year_published;
        //write it back to db
        const editStatus = await bookSelected.save();
        logger.info(`Edited a book: ${JSON.stringify(oldBook)} -> ${JSON.stringify(bookSelected)}`);
        return editStatus
    } catch (err) {
        logger.error(`Error editing a book in books_service: ${err}`);
        throw err;
    }
}


module.exports = {
    all_book_get,
    create_book_post,
    delete_book_post,
    edit_book_post
}