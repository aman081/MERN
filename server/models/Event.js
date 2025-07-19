const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  day: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  branchTags: [{
    type: String,
    required: true
  }],
  gameType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Boys', 'Girls'],
    required: true
  },
  eventType: {
    type: String,
    enum: ['Individual', 'Team'],
    required: true
  },
  points: {
    first: {
      type: Number,
      required: true
    },
    second: {
      type: Number,
      required: true
    },
    third: {
      type: Number,
      required: true
    }
  },
  result: {
    type: String
  },
  coverImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Active', 'Concluded'],
    default: 'Upcoming'
  },
  winners: [{
    position: {
      type: String,
      enum: ['First', 'Second', 'Third', 'Team']
    },
    branch: String,
    points: Number,
    playerOfTheMatch: String // Only for Team events
  }]
}, {
  timestamps: true
});

// Indexes for performance
eventSchema.index({ status: 1 });
eventSchema.index({ branchTags: 1 });
eventSchema.index({ gameType: 1 });
eventSchema.index({ day: 1 });

module.exports = mongoose.model('Event', eventSchema); 