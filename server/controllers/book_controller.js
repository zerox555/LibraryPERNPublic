const books = require('express').Router()
const db = require('../models')
const { Book } = db

// GET ALL BOOKS
const all_book_get =  async (req, res) => {
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
        const {name,author,year_published} = req.body;
        const newBook = await Book.create({
            name,
            author,
            year_published}
        )
        res.status(200).json(newBook)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

// DELETE A BOOK
const delete_book_post = async (req,res) => {
    try {
        const {book_id} = req.body;
        
        const deleteStatus = Book.destroy({
            where:{
                book_id
            }
        })
        res.status(200).json(deleteStatus)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

module.exports={
    all_book_get,
    create_book_post,
    delete_book_post
}
