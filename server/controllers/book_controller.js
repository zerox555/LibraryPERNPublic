const books = require('express').Router()
const db = require('../models')
const { Book } = db

const {all_book_get,create_book_post,delete_book_post} = require("../services/book_service");

// GET ALL BOOKS
const all_book_get_controller = async (req, res) => {
    try {
        const foundBooks = await all_book_get();
        res.status(200).json(foundBooks)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
};

// ADD NEW BOOK
const create_book_post_controller = async (req, res) => {
    try {
        const { name, author, year_published } = req.body;
        const newBook = await create_book_post({name,author,year_published});
        res.status(200).json(newBook)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

// DELETE A BOOK
const delete_book_post_controller = async (req, res) => {
    try {
        const { book_id } = req.body; 

        if (!book_id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        console.log(book_id);
        const deleteStatus = await delete_book_post(book_id); // Call the service to delete the book
        res.status(200).json(deleteStatus); // Send the status back in the response
    } catch (err) {
        res.status(500).send("Server error");
        console.log(err); // Log the error for debugging
    }
};

//MODIFY A BOOK
const edit_book_post = async (req, res) => {
    try {
        //get book by book id
        const { name, author, year_published, book_id } = req.body;
        const bookSelected = await Book.findOne({ where: { book_id: book_id } })
        //change fields
        console.log(bookSelected);
        console.log("name is " + name);
        console.log("author is" + author);
        console.log("year is " + year_published);
        bookSelected.name = name;
        bookSelected.author = author;
        bookSelected.year_published = year_published;
        //write it back to db
        const editStatus = await bookSelected.save();
        res.status(200).json(editStatus)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

module.exports = {
    all_book_get_controller,
    create_book_post_controller,
    delete_book_post_controller,
    edit_book_post
}
