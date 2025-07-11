const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const photoController = require('../controllers/photoController');

const router = express.Router();

// Public routes
router.get('/', photoController.getPhotos);
router.get('/:id', photoController.getPhoto);

// Admin routes (protected)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('url').isURL().withMessage('Valid image URL is required')
], photoController.uploadPhoto);

router.put('/:id', [
  authenticateToken,
  requireAdmin
], photoController.updatePhoto);

router.delete('/:id', [
  authenticateToken,
  requireAdmin
], photoController.deletePhoto);

module.exports = router; 