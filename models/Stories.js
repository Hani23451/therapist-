const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content_free: {
      type: String,
    },
    content_paid: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    content: {
      type: String,
    },
    jewelCount: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },

    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    audio: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Experience", ExperienceSchema);
