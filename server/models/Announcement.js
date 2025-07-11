const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema); 