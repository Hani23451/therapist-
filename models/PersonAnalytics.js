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
    image: {
        type: String, // URL or path to the image
        default: null,
    }
}, {
    timestamps: true,
});

const PersonAnalytics = mongoose.model('PersonAnalytics', personAnalyticsSchema);

module.exports = PersonAnalytics;
