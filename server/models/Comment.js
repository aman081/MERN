const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  announcementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
commentSchema.index({ announcementId: 1 });
commentSchema.index({ userId: 1 });

module.exports = mongoose.model('Comment', commentSchema); 