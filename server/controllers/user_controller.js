const users = require('express').Router()
const { useState } = require('react');
const db = require('../models')
const { User } = db
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");



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
            password: hash
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
    let token;

    try {
        const { name, password } = req.body;
        let authenticated = false;
        const user = await User.findOne({
            where: {
                name: name
            }
        })

        if (await argon2.verify(user.password, password)) {
            authenticated = true
            //set jwt token here 
            try {
                //Creating JWT token
                token = jwt.sign(
                    {
                        id:user.id,
                        name:name,
                    },
                    // secret key value
                    process.env.REACT_APP_JWT_SECRET,
                    { expiresIn: "1h" }
                )

            } catch (err) {
                console.log(err);
                const error =
                    new Error("Error! Something went wrong.");
                return next(error);
            }
        }
        else {
        }
        res.status(200).json({success: authenticated,
            data:{
                id:user.id,
                name:name,
                token:token,
            }
        })
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
}

// Log out user [Not completed]
const logout_user = async (req, res) => {
    //remove from state
    try {
        //hash code here 
        res.status(200).json(newUser)
    } catch (err) {
    }
}

// Check jwt Token TODO:REMOVE (already in middleware)
const check_jwt_token = async (req, res) => {
    try {
        const token =
        req.headers.authorization.split(' ')[1];
        
        // Verify token
        const verified = jwt.verify(token,process.env.REACT_APP_JWT_SECRET);
        
        res.status(200).json({"token exist: " :verified});
        // res.status(200).json(req.headers.authorization.split(' ')[1]);
    } catch (err) {
        res.status(500).json({"Invalid token " :  err});
    }
}

module.exports = {
    all_user_get,
    create_user_post,
    user_auth,
    logout_user,
    check_jwt_token
}