const mongoose = require("mongoose");

const Questions = new mongoose.Schema(
  {
  
    answer: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Questions", Questions);
