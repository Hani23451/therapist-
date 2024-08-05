// models/personAnalytics.model.js
const mongoose = require('mongoose');

const personAnalyticsSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
  },
  description: {
      type: String,
      required: true,
  },
  video: {
      type: String, // URL or path to the video
      default: null,
  },
  tasks: {
      type: [String], // Array of strings for tasks
      default: [],
  }
}, {
  timestamps: true,
});

const PersonAnalytics = mongoose.model('PersonAnalytics', personAnalyticsSchema);

module.exports = PersonAnalytics;
