const { create_user_post, auth_user } = require("../services/user_service");
const logger = require("../config/logger")
require('dotenv').config();

// ADD NEW USER
const create_user_post_controller = async (req, res) => {
    try {
        const { name, password } = req.body;
        const newUser = await create_user_post({ name, password });
        const msg = (newUser.errorMsg)
            ? "New User creation failed"
            : "New User creation completed";
        logger.debug(process.env.NODE_ENV);
        res.status(200).send(newUser);
        logger.info(`${msg} @ user_controller` );
    } catch (err) {
        res.status(500).send("Server error");
        logger.info("New User creation failed");
        logger.error(err)
    }
}

// AUTHENTICATES USER
const auth_user_controller = async (req, res) => {
    try {
        const { name, password } = req.body;
        const validUser = await auth_user({ name, password });
        const msg = (validUser.data.errorMsg)
            ? "User authentication failed"
            : "User authentication completed";
        res.status(200).json(validUser);
        logger.info(`${msg} @ user_controller` );
    } catch (err) {
        res.status(500).send("Server error");
        logger.info("User authentication failed");
        logger.error(err)
    }
}

module.exports = {
    create_user_post_controller,
    auth_user_controller,
}