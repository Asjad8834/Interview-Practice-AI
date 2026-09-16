const userModel = require("../models/user.model");
const tokenBlackListModel = require("../models/tokenBlackList.model")

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 *  @name registerUser
 *  @description Register a new user, accepts username,    email and password in the request body
 *  @access Public
 */

async function registerUser(req, res){
  try{

    const { username, email, password } = req.body;

    if(!username || !email || !password){
      return res.status(401).json({
        success: false,
        message:"All fields are required"
      });
    }

    //Check if a user with these credentials already exists
    const userAlreadyExists = await userModel.findOne({
      $or:[
        { username }, { email }
      ]
    })

    if(userAlreadyExists){
      return res.status(401).json({
        success: false,
        message:"User already exists"
      })
    }

    //Hash the user passoword
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: passwordHash,
    })

    //Assigning a TOKEN to the user
    const token = jwt.sign({
      id: user._id,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24*60*60*1000
    });

    //Return teh final response to the user

    return res.status(201).json({
      success: true,
      message: "User created Successfully",
      user:{
        id: user._id,
        username: user.username,
        email: user.email
      },
      token: token
    })

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message:"Internal server error",
      error: error.message
    })
  }
}


/**
 * @name loginUser
 * @description login a user, expects email and password in the request body
 * @access Public
 */

async function loginUser(req, res){
  try{

    const { email, password } = req.body;

    if(!email || !password){
      return res.status(401).json({
        success: false,
        message:"email and password is required"
      })
    }

    // We will fetch the user with these credentials
    const user = await userModel.findOne({ email });

    if(!user){
      return res.status(401).json({
        success: false,
        message:"Invalid credentials"
      })
    }

    // we will check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.status(401).json({
        success: false,
        message:"Invalid credentials"
      })
    }

    // When the user credentials is verified we will assign a token

    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_SECRET, {expiresIn: "1d"});

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24*60*60*1000
    });

    // Return the user data
    return res.status(200).json({
      success: true,
      message:"User logged in successfully",
      user:{
        id: user._id,
        username: user.username,
        email: user.email
      },
      token: token
    })

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message:"Internal server error",
      error: error.message
    })
  }
}


/**
 * @name logOutUser
 * @description logout a user
 * @access Public
 */

async function logOutUser(req, res){
  try{

    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if(token){
      await tokenBlackListModel.create({
        token,
      })
    }

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message:"User logged out succesfully"
    })

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message:"Internal server error",
      error: error.message
    })
  }
}


/**
 * @name getMe
 * @description get the current logged in user details
 * @access Private
 */
async function getMe(req, res){
  try{

    const user = await userModel.findById(req.user.id);
    //since we are using auth middleware, we can be sure that the user is authenticated and the user id is available in the req.user object

    if(!user){
      return res.status(401).json({
        success: false,
        message:"Unauthorized, user not found"
      })
    }

    return res.status(200).json({
      success: true,
      message:"User details fetched successfully",
      user:{
        id: user._id,
        username: user.username,
        email: user.email
      }
    })

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message:"Internal server error",
      error: error.message
    })
  }
}




module.exports = { registerUser, loginUser, logOutUser, getMe };