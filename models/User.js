const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
    },
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    storiesSubscriptions: [

    ],
    experienceSubscriptions: [

    ],
    GamesSubscriptions: [

    ],

    relationshipStatus: {
      type: String,
      enum: ["single", "pending", "accepted", "completed"],
      default: "single",
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
    personType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonAnalytics", // Reference to the User model
    },

    gemsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
 

module.exports = mongoose.model("User", UserSchema);
