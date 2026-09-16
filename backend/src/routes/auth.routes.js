const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUser);


/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUser);


/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token in the blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logOutUser);



/**
 * @route GET /api/auth/get-me
 * @description get the current logged in used details
 * @access Private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMe );


module.exports = authRouter;