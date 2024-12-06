const { create_user_post, auth_user } = require("../services/user_service");
const pino = require('pino');

const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  });
  

// ADD NEW USER
const create_user_post_controller = async (req, res) => {
    try {
        const { name, password } = req.body;
        const newUser = await create_user_post({ name, password });
        logger.info("New User created");
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

module.exports = {
    create_user_post_controller,
    auth_user_controller,
}