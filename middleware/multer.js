const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");


const storage = new CloudinaryStorage({
    cloudinary,
    params:{
          folder:"hostel",
          resource_type:"auto",

    transformation: [
      { width: 1200, crop: "limit" },
      { quality: "auto", fetch_format: "auto" }
    ]
    }

      
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }

});

module.exports = upload;
