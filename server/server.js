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
app.use(express.static(path.join(__dirname, "../build")));

//CONTROLLERS
const bookController = require('./controllers/book_controller');
app.use('/api/books', bookController);

app.use('*', (req,res) =>{
    res.sendFile(path.join(__dirname,"../build/index.html"));
});

//LISTEN    
app.listen(8080, "127.0.0.1", () =>{
   
    console.log("Server running on port 8080")
});