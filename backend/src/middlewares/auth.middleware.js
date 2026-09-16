const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenBlackList.model");

async function authUser(req, res, next){
  try{

    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if(!token){
      return res.status(401).json({
        success: false,
        message:"Unauthorized, token missing"
      })
    }

    // We will check whether or not the token is blacklisted 
    const isTokenBlackListed = await tokenBlackListModel.findOne({
      token
    });

    if(isTokenBlackListed){
      return res.status(401).json({
        message:"Token is Invalid"
      })
    }

    // Now we will verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message:"Internal server error",
      error: error.message
    })
  }
}

module.exports = { authUser };