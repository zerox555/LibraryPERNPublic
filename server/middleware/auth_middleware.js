const jwt = require('jsonwebtoken');
const logger = require("../config/logger")
require('dotenv').config();


const verify_jwt_token = async (req, res, next) => {
  const authHeader = req.headers?.authorization || "";
  console.log(`authHeader is ${authHeader}`);
  if (!authHeader) {
    console.log("authheader not pressent");
    logger.warn("Attempted access without header @ auth_middleware");
    return res.status(401).send('Access Denied');
  }

  const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

  try {
    const verified = jwt.verify(token, process.env.REACT_APP_JWT_SECRET); // Verify the token
    logger.info(`JWT token: ${token} validated @ auth_middleware`);
    logger.info(`Proceeding to next stop`);
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("here in error")
    logger.warn("Attempted access with invalid token @ auth_middleware");
    res.status(403).send('Invalid Token');
  }
};

module.exports = {
  verify_jwt_token
}