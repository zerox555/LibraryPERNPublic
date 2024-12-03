const db = require('../models')
const { User } = db
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");

// ADD NEW USER TO DB
const create_user_post = async (userData) => {
    try {
        const hash = await argon2.hash(userData.password);
        const newUser = await User.create({
            name: userData.name,
            password: hash,
            roles:["user"]
        }
        );
        return newUser;
    } catch (err) {
        Alert("Error creating user: " + err.message);
    }
};

// AUTHENTICATE USER
const auth_user = async (userData) => {
    let token;
    try {
        let authenticated = false;
        const user = await User.findOne({
            where: {
                name: userData.name
            }
        })

        if (await argon2.verify(user.password, userData.password)) {
            authenticated = true
            //set jwt token here 
            try {
                //Creating JWT token
                token = jwt.sign(
                    {
                        id: user.id,
                        name: userData.name,
                        roles:user.roles
                        //TODO: ADD ROLES HERE
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
        return ({
            success: authenticated,
            data: {
                id: user.id,
                name: userData.name,
                token: token,
            }
        })
    } catch (err) {
        console.log(err)
    }
};

module.exports = {
    create_user_post,
    auth_user
}