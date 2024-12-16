const { all_book_get, create_book_post, delete_book_post, edit_book_post } = require("../services/book_service");
const logger = require("../config/logger")
const AppError = require("../appError")
require('dotenv').config();

// GET ALL BOOKS
const all_book_get_controller = async (req, res,next) => {
    try {
        const foundBooks = await all_book_get();
        logger.info(`Find all books transaction done @ book_controller`);
        res.status(200).json(foundBooks)
    } catch (err) {
        next(err)
        // res.status(500).send("Server error")
        logger.error(`Error occured @ book_controller: ${err}`)

    }
};

// ADD NEW BOOK
const create_book_post_controller = async (req, res,next) => {
    try {
        const { name, author, year_published } = req.body;
        const newBook = await create_book_post({ name, author, year_published });
        logger.info(`Create book transaction done @ book_controller`);
        res.status(200).json(newBook)
    } catch (err) {
        next(err)
        // res.status(500).send("Server error")
        logger.error(`Error occured @ book_controller: ${err}`)

    }
}

// DELETE A BOOK
const delete_book_post_controller = async (req, res,next) => {
    try {
        const { book_id } = req.body;

        if (!book_id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        console.log(book_id);
        const deleteStatus = await delete_book_post(book_id);
        logger.info(`Delete book transaction done @ book_controller`);
        res.status(200).json(deleteStatus);
    } catch (err) {
        next(err);
        // res.status(500).send("Server error");
        logger.error(`Error occured @ book_controller: ${err}`)

    }
};

//MODIFY A BOOK
const edit_book_post_controller = async (req, res,next) => {
    try {
        const { name, author, year_published, book_id } = req.body;
        // might return error if edit failed
        const editStatus = await edit_book_post({ name, author, year_published, book_id })
        logger.info(`Edit book transaction done @ book_controller`);
        res.status(200).json(editStatus)
    } catch (err) {
        next(err)
        // res.status(500).send("Server error")
        logger.error(`Error occured @ book_controller: ${err}`)
    }
}

module.exports = {
    all_book_get_controller,
    create_book_post_controller,
    delete_book_post_controller,
    edit_book_post_controller
}
