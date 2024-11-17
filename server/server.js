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
// const bookController = require('./controllers/book_controller');
// app.use('/api/books', bookController);
// app.use('/api/createbook', bookController);

const {all_book_get,create_book_post,delete_book_post} = require('./controllers/book_controller');
app.use('/api/books/', all_book_get);
app.post('/api/createbook/', create_book_post);
app.post('/api/deletebook/', delete_book_post);



app.use('*', (req,res) =>{
    res.sendFile(path.join(__dirname,"../build/index.html"));
});

//LISTEN    
app.listen(8080, () =>{
   
    console.log("Server running on port 8080")
});