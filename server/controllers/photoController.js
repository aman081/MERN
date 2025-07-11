const Photo = require('../models/Photo');

// Upload photo
const uploadPhoto = async (req, res) => {
  try {
    const { eventId, url, caption, tags, isCover } = req.body;
    const photo = new Photo({ eventId, url, caption, tags, isCover });
    await photo.save();
    res.status(201).json({ success: true, data: photo, message: 'Photo uploaded' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error uploading photo', error: error.message });
  }
};

// Get all photos
const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching photos', error: error.message });
  }
};

// Get single photo
const getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching photo', error: error.message });
  }
};

// Update photo
const updatePhoto = async (req, res) => {
  try {
    const { eventId, url, caption, tags, isCover } = req.body;
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { eventId, url, caption, tags, isCover },
      { new: true, runValidators: true }
    );
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({ success: true, data: photo, message: 'Photo updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating photo', error: error.message });
  }
};

// Delete photo
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({ success: true, message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting photo', error: error.message });
  }
};

module.exports = {
  uploadPhoto,
  getPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto
}; 