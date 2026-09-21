const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenBlackList.model");

async function authUser(req, res, next) {
  try {

    console.log("AUTH DEBUG:", {
      hasCookieHeader: !!req.headers.cookie,
      hasTokenCookie: !!req.cookies?.token,
      origin: req.headers.origin,
    });

    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, token missing",
      });
    }

    const isTokenBlackListed =
      await tokenBlackListModel.findOne({ token });

    if (isTokenBlackListed) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

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