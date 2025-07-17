const express = require('express');
const { getLeaderboard, getPointsSystem, clearLeaderboard, setManualLeaderboard } = require('../controllers/leaderboardController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getLeaderboard);
router.get('/points-system', getPointsSystem);
router.post('/clear', authenticateToken, requireAdmin, clearLeaderboard);
router.patch('/manual', authenticateToken, requireAdmin, setManualLeaderboard);

module.exports = router; 