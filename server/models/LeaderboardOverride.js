const mongoose = require('mongoose');

const leaderboardOverrideSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
    unique: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  firstCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  secondCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  thirdCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LeaderboardOverride', leaderboardOverrideSchema); 