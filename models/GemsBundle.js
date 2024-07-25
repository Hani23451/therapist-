const mongoose = require("mongoose");

const GemsBundle = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("GemsBundle", GemsBundle);
