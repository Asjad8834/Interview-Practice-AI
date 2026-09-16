const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenBlackList.model");

async function authUser(req, res, next) {
  try {
    let token = req.cookies.token;

    // If token is not available in cookies,
    // try getting it from Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, token missing",
      });
    }

    // Check whether the token is blacklisted
    const isTokenBlackListed = await tokenBlackListModel.findOne({
      token,
    });

    if (isTokenBlackListed) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = { authUser };