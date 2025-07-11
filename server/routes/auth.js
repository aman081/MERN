const express = require('express');
const { body } = require('express-validator');
const { adminLogin, publicLogin, getCurrentUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/admin/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], adminLogin);

// Public user login
router.post('/public/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], publicLogin);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router; 