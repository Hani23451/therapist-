const mongoose = require("mongoose");

const Settings = new mongoose.Schema({
  tiktok: {
    type: String,
    required: true,
  },
  facebook: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
    required: true,
  },
  youtube: {
    type: String,
    required: true,
  },
  snapchat: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Settings", Settings);
