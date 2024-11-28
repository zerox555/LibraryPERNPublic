const users = require('express').Router()
const db = require('../models')
const { User } = db


// GET ALL USERS (JUST FOR TESTING)
const all_user_get = async (req, res) => {
    try {
        const foundUsers = await User.findAll()
        res.status(200).json(foundUsers)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
};

// ADD NEW BOOK
const create_user_post = async (req, res) => {
    try {
        const { name, password } = req.body;
        const newUser = await User.create({
            name,
            password
        }
        )
        console.log(newUser)
        res.status(200).json(newUser)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

module.exports = {
    all_user_get,
    create_user_post
}