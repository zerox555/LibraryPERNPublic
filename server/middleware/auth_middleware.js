const jwt = require('jsonwebtoken');


const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).send('Access Denied');
    }
  
    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
  
    try {
      const verified = jwt.verify(token,process.env.REACT_APP_JWT_SECRET); // Verify the token
    //   req.user = verified; // Attach user info to the request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(403).send('Invalid Token');
    }
  };

  module.exports ={
    verifyToken
  }