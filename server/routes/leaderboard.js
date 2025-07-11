const express = require('express');
const { getLeaderboard, getPointsSystem } = require('../controllers/leaderboardController');

const router = express.Router();

// Public routes
router.get('/', getLeaderboard);
router.get('/points-system', getPointsSystem);

module.exports = router; 