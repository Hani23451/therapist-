const mongoose = require("mongoose");

const TherapistProvider = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }, 
    password:{ 
      type: String,
      required: true,
    } ,
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    type: {
      type: String,
      enum: ["consultant", "teacher"],
      default: "teacher",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TherapistProvider", TherapistProvider);
