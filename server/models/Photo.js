const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isCover: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
photoSchema.index({ eventId: 1 });
photoSchema.index({ isCover: 1 });

module.exports = mongoose.model('Photo', photoSchema); 