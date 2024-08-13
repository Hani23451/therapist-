const mongoose = require("mongoose");

const GameModelOne = new mongoose.Schema(
  { 
    type:{ 
      type: String, 
      default:"GameModelOne",
    } ,
    image: {
      type: String,
      required: true,
    },
    timeCounter: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    gemsCount: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
    },
    content: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GameModelOne", GameModelOne);
