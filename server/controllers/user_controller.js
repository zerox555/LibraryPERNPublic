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
                const jwt = require("jsonwebtoken")
                token = jwt.sign(
                    {
                        id:user.id,
                        name:name,
                    },
                    // secret key value
                    "eac74663a66c7a059d420f8e8c678c271b6922ba00780f888f2d8deefc3f73f675599f8b83390bcf93dfa62e6b91c23e77e59ba4c0272e3840b204893368f52c08f6d01ba65d2fc2df81dc31ac10cfde34e5e078e80dcebdad44f3ab47161ef181d058c28519522aacfee66a74a926046dd1ecd21bab2e709527eb6023d9394ef77462a9b93e47a2809233ca98ef91599276ad384ab0d5ae37bd49df1d3982360005686d98a761cab16ee26c17738fa7dc06b1fd841857d8a1df902aca7ed2fd4c1da317189b6fcb81c7ceee214c1996fb901b9bd584b2310b3686134ffc192f482d471f6f9360cb47fbbfe1f8d2bfc740462510696d993e8c2507c7394812c6",
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

module.exports = {
    all_user_get,
    create_user_post,
    user_auth
}