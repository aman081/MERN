const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const announcementController = require('../controllers/announcementController');

const router = express.Router();

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

router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Announcement title is required'),
  body('body').notEmpty().withMessage('Announcement body is required')
], announcementController.updateAnnouncement);

router.delete('/:id', [
  authenticateToken,
  requireAdmin
], announcementController.deleteAnnouncement);

module.exports = router; 