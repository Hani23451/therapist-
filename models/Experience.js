const mongoose = require("mongoose");

const ExpSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["publish", "published"],
      default: "publish",
  
    },

    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    jewelCount: {
      type: Number,
  
    },
    isPaid: {
      type: Boolean,
  
    },

  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Exp", ExpSchema);
