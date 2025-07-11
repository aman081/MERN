const express = require('express');
const { body } = require('express-validator');
const { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent, 
  updateEventStatus, 
  addWinners 
} = require('../controllers/eventController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Admin routes (protected)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Event name is required'),
  body('description').notEmpty().withMessage('Event description is required'),
  body('day').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Event time is required'),
  body('venue').notEmpty().withMessage('Event venue is required'),
  body('branchTags').isArray().withMessage('Branch tags must be an array'),
  body('gameType').notEmpty().withMessage('Game type is required'),
  body('category').isIn(['Boys', 'Girls']).withMessage('Category must be Boys or Girls'),
  body('eventType').isIn(['Individual', 'Team']).withMessage('Event type must be Individual or Team'),
  body('points.first').isNumeric().withMessage('First place points must be a number'),
  body('points.second').isNumeric().withMessage('Second place points must be a number'),
  body('points.third').isNumeric().withMessage('Third place points must be a number')
], createEvent);

router.put('/:id', [
  authenticateToken,
  requireAdmin
], updateEvent);

router.delete('/:id', [
  authenticateToken,
  requireAdmin
], deleteEvent);

router.patch('/:id/status', [
  authenticateToken,
  requireAdmin,
  body('status').isIn(['Upcoming', 'Active', 'Concluded']).withMessage('Invalid status')
], updateEventStatus);

router.patch('/:id/winners', [
  authenticateToken,
  requireAdmin,
  body('winners').isArray().withMessage('Winners must be an array')
], addWinners);

module.exports = router; 