const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName1: {
    type: String,
    required: true
  },
  userName2: {
    type: String,
    required: true
  },

  engagementDate: {
    type: Date
  },
  marriageDate: {
    type: Date
  },
  proposalDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Relationship', RelationshipSchema);
