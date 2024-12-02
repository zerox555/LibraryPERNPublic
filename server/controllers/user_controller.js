const users = require('express').Router()
const { useState } = require('react');
const db = require('../models')
const { User } = db
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");

const { create_user_post, auth_user } = require("../services/user_service");



// ADD NEW USER
const create_user_post_controller = async (req, res) => {
    try {
        const { name, password } = req.body;
        const newUser = await create_user_post({ name, password });
        res.status(200).send(newUser);
    } catch (err) {
        res.status(500).send("Server error");
        console.log(err);
    }
}

// AUTHENTICATES USER
const auth_user_controller = async (req, res) => {
    try {
        const { name, password } = req.body;
        const validUser = await auth_user({ name, password });
        res.status(200).json(validUser);
    } catch (err) {
        res.status(500).send("Server error");
        console.log(err);
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

module.exports = {
    create_user_post_controller,
    auth_user_controller,
    logout_user,
}