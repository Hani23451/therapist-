// config/cloudinary.config.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "dtsbbzutu",
  api_key: "986537359926711",
  api_secret: "F2w4RwfRPPu8gdZ-5aK0P-5nKAk",
});

module.exports = cloudinary;
