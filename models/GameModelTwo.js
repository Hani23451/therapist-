const mongoose = require("mongoose");

const GameModelTow = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "GameModelTwo",
    },
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
    content: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GameModelTow", GameModelTow);
