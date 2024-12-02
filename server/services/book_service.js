const books = require('express').Router()
const db = require('../models')
const { Book } = db

// GET ALL BOOKS
const all_book_get = async () => {
    try {
        const foundBooks = await Book.findAll()
        return foundBooks;
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
};

// ADD NEW BOOK
const create_book_post = async (bookData) => {
    try {
        const { name, author, year_published } = bookData;
        const newBook = await Book.create({
            name,
            author,
            year_published
        }
        )
        return newBook;
    } catch (err) {
        console.log(err)
    }
}

// DELETE A BOOK
const delete_book_post = async (book_id) => {
    try {
        if (!book_id){
            return false
        }
        const deleteStatus = await Book.destroy({
            where: {
                book_id:book_id
            }
        })
        return deleteStatus;
    } catch (err) {
        console.log(err)
    }
}



module.exports = {
    all_book_get,
    create_book_post,
    delete_book_post
}