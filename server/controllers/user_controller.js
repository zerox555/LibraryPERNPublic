const users = require('express').Router()
const { useState } = require('react');
const db = require('../models')
const { User } = db
const argon2 = require('argon2');


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
        const hash = await argon2.hash(password);
        const newUser = await User.create({
            name,
            password:hash
        }
        )
        //hash code here 
        res.status(200).json(newUser)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

const user_auth = async (req, res) => {
    try {
        const { name, password } = req.body;
        let authenticated = false;
        //find specific user name and check if password hash is correct 
        const user = await User.findOne({where:{
            name: name
        }})
        //return authenticated boolean
        if (await argon2.verify(user.password, password)) {
            // password match
            authenticated = true
          } else {
            // password did not match
          }
        res.status(200).json(authenticated)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

module.exports = {
    all_user_get,
    create_user_post,
    user_auth
}