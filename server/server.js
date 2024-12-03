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

// Controller
const {all_book_get_controller,create_book_post_controller,delete_book_post_controller,edit_book_post_controller} = require('./controllers/book_controller');
const {create_user_post_controller,auth_user_controller} = require('./controllers/user_controller');

// Middleware 
const {verify_jwt_token} = require("./middleware/auth_middleware")
const {check_scopes} = require("./middleware/rbac_middleware")


// FOR BOOKS
app.use('/api/books/',verify_jwt_token,check_scopes("read_book"), all_book_get_controller);
app.post('/api/createbook/',verify_jwt_token,check_scopes("create_book"), create_book_post_controller);
app.post('/api/deletebook/',verify_jwt_token,check_scopes("delete_book"), delete_book_post_controller);
app.post('/api/editbook/',verify_jwt_token,check_scopes("update_book"), edit_book_post_controller);

// FOR USERS
// app.use("/api/users/",all_user_get);
app.use("/api/createuser/", create_user_post_controller);
app.use('/api/authuser/',auth_user_controller);

// TESTING
// app.use('/api/verifytoken/',check_jwt_token);
// app.use('/protected',verify_jwt_token,check_jwt_token);


app.use('*', (req,res) =>{
    res.sendFile(path.join(__dirname,"../build/index.html"));
});

//LISTEN    
app.listen(8080, () =>{
   
    console.log("Server running on port 8080")
});