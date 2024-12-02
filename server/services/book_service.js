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
const create_book_post = async ({name,author,year_published}) => {
    try {
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

// MODIFY A BOOK
const edit_book_post = async ({ name, author, year_published, book_id }) => {
    try {
        //get book by book id
        const bookSelected = await Book.findOne({ where: { book_id: book_id } })
        //change fields
        bookSelected.name = name;
        bookSelected.author = author;
        bookSelected.year_published = year_published;
        //write it back to db
        const editStatus = await bookSelected.save();
        return editStatus
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    all_book_get,
    create_book_post,
    delete_book_post,
    edit_book_post
}