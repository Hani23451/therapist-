const mongoose = require("mongoose");

const GameModelThree = new mongoose.Schema(
  { 
    type:{ 
      type: String, 
      default:"GameModelThree",
    } ,
    image: {
      type: String,
      required: true,
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

module.exports = mongoose.model("GameModelThree", GameModelThree);
