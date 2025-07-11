const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Placeholder for announcement controller
const announcementController = {
  createAnnouncement: async (req, res) => {
    res.json({ success: true, message: 'Create announcement endpoint' });
  },
  getAnnouncements: async (req, res) => {
    res.json({ success: true, message: 'Get announcements endpoint' });
  },
  getAnnouncement: async (req, res) => {
    res.json({ success: true, message: 'Get single announcement endpoint' });
  }
};

// Public routes
router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncement);

// Admin routes (protected)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Announcement title is required'),
  body('body').notEmpty().withMessage('Announcement body is required')
], announcementController.createAnnouncement);

module.exports = router; 