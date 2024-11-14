// DEPENDENCIES
const express = require("express");
const app = express();
const {Sequelize} = require('sequelize');
const path = require('path');
const cors = require('cors');

//CONFIGURATION
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//CONTROLLERS
const bookController = require('./controllers/book_controller');
app.use('/api/books', bookController);

//LISTEN    
app.listen(4005, () =>{
   
    console.log("Server running on port 4005")
});