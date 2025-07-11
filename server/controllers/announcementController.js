const Announcement = require('../models/Announcement');

// Create announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const announcement = new Announcement({ title, body, image });
    await announcement.save();
    res.status(201).json({ success: true, data: announcement, message: 'Announcement created' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating announcement', error: error.message });
  }
};

// Get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching announcements', error: error.message });
  }
};

// Get single announcement
const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching announcement', error: error.message });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, body, image },
      { new: true, runValidators: true }
    );
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, data: announcement, message: 'Announcement updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating announcement', error: error.message });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting announcement', error: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
}; 