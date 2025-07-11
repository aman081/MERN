const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin, requirePublicUser } = require('../middleware/auth');
const commentController = require('../controllers/commentController');

const router = express.Router();

// Public routes
router.get('/', commentController.getComments);

// Public user routes (protected)
router.post('/', [
  authenticateToken,
  requirePublicUser,
  body('announcementId').isMongoId().withMessage('Valid announcement ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('content').notEmpty().withMessage('Comment content is required')
], commentController.createComment);

// Admin routes (protected)
router.delete('/:id', [
  authenticateToken,
  requireAdmin
], commentController.deleteComment);

module.exports = router; 