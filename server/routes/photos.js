const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Placeholder for photo controller
const photoController = {
  uploadPhoto: async (req, res) => {
    res.json({ success: true, message: 'Photo upload endpoint' });
  },
  getPhotos: async (req, res) => {
    res.json({ success: true, message: 'Get photos endpoint' });
  }
};

// Public routes
router.get('/', photoController.getPhotos);

// Admin routes (protected)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('url').isURL().withMessage('Valid image URL is required')
], photoController.uploadPhoto);

module.exports = router; 