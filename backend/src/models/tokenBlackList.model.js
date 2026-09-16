// Ideally for token blacklisting we use redis but for our development project we will user mongoDb
const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({

  token:{
    type: String,
    required: [true, "Token is required for blacklisting"]
  }

}, { timestamps: true });


const tokenblackListModel = mongoose.model("blacklistTokens", blackListTokenSchema);

module.exports = tokenblackListModel;