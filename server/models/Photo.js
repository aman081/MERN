const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true
  },
  sportsTag: {
    type: String,
    required: true,
    trim: true
  },
  branchTags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Photo', photoSchema); 