const multer = require("multer");



const upload = multer({

  storage: multer.memoryStorage(), // to store temporarily
  limits:{
    fileSize: 3 * 1024 * 1024 // 3MB 
  }

})

module.exports = upload;