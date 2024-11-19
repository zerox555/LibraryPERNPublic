const books = require('express').Router()
const db = require('../models')
const { Book } = db

// GET ALL BOOKS
const all_book_get = async (req, res) => {
    try {
        const foundBooks = await Book.findAll()
        res.status(200).json(foundBooks)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
};

// ADD NEW BOOK
const create_book_post = async (req, res) => {
    try {
        const { name, author, year_published } = req.body;
        const newBook = await Book.create({
            name,
            author,
            year_published
        }
        )
        res.status(200).json(newBook)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

// DELETE A BOOK
const delete_book_post = async (req, res) => {
    try {
        const { book_id } = req.body;

        const deleteStatus = Book.destroy({
            where: {
                book_id
            }
        })
        res.status(200).json(deleteStatus)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

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
    all_book_get,
    create_book_post,
    delete_book_post,
    edit_book_post
}
