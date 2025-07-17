const Event = require('../models/Event');
const LeaderboardOverride = require('../models/LeaderboardOverride');

// Calculate leaderboard from concluded events
const getLeaderboard = async (req, res) => {
  try {
    // Get all concluded events
    const concludedEvents = await Event.find({ status: 'Concluded' });

    // Calculate points for each branch
    const branchPoints = {};

    concludedEvents.forEach(event => {
      event.winners.forEach(winner => {
        const branch = winner.branch;
        
        if (!branchPoints[branch]) {
          branchPoints[branch] = {
            branch,
            points: 0,
            firstCount: 0,
            secondCount: 0,
            thirdCount: 0
          };
        }

        branchPoints[branch].points += winner.points;

        // Count medals for tie-breaking
        if (winner.position === 'First' || winner.position === 'Team') {
          branchPoints[branch].firstCount += 1;
        } else if (winner.position === 'Second') {
          branchPoints[branch].secondCount += 1;
        } else if (winner.position === 'Third') {
          branchPoints[branch].thirdCount += 1;
        }
      });
    });

    // Ensure all branches are present
    const ALL_BRANCHES = ['CSE', 'ECE', 'CE', 'ME', 'EE', 'MME', 'PIE+ECM'];
    ALL_BRANCHES.forEach(branch => {
      if (!branchPoints[branch]) {
        branchPoints[branch] = {
          branch,
          points: 0,
          firstCount: 0,
          secondCount: 0,
          thirdCount: 0
        };
      }
    });

    // Merge manual overrides
    const overrides = await LeaderboardOverride.find({});
    overrides.forEach(override => {
      if (branchPoints[override.branch]) {
        branchPoints[override.branch].points = override.points;
        branchPoints[override.branch].firstCount = override.firstCount;
        branchPoints[override.branch].secondCount = override.secondCount;
        branchPoints[override.branch].thirdCount = override.thirdCount;
      }
    });

    // Convert to array and sort
    const leaderboard = Object.values(branchPoints).sort((a, b) => {
      // First sort by total points
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // Tie-breaker: most 1st place medals
      if (b.firstCount !== a.firstCount) {
        return b.firstCount - a.firstCount;
      }
      // Further tie-breaker: most 2nd place medals
      if (b.secondCount !== a.secondCount) {
        return b.secondCount - a.secondCount;
      }
      // Final tie-breaker: most 3rd place medals
      return b.thirdCount - a.thirdCount;
    });

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating leaderboard',
      error: error.message
    });
  }
};

// Get points system (static data)
const getPointsSystem = async (req, res) => {
  try {
    // This would typically come from a database, but for now we'll return static data
    const pointsSystem = {
      Boys: {
        Cricket: { first: 5, second: 3, third: 1 },
        Football: { first: 7, second: 4, third: 2 },
        Basketball: { first: 6, second: 3, third: 1 },
        Volleyball: { first: 5, second: 3, third: 1 },
        Badminton: { first: 4, second: 2, third: 1 },
        TableTennis: { first: 3, second: 2, third: 1 },
        Athletics: { first: 5, second: 3, third: 1 },
        Hockey: { first: 5, second: 3, third: 1 },
        Chess: { first: 5, second: 3, third: 1 },
        LawnTennis: { first: 5, second: 3, third: 1 },
        Marathon: { first: 5, second: 3, third: 1 },
        Yoga: { first: 5, second: 3, third: 1 },
        Parade: { first: 10, second: 5, third: 2.5 }
      },
      Girls: {
        Cricket: { first: 5, second: 3, third: 1 },
        Football: { first: 7, second: 4, third: 2 },
        Basketball: { first: 6, second: 3, third: 1 },
        Volleyball: { first: 5, second: 3, third: 1 },
        Badminton: { first: 4, second: 2, third: 1 },
        TableTennis: { first: 3, second: 2, third: 1 },
        Athletics: { first: 5, second: 3, third: 1 },
        Hockey: { first: 5, second: 3, third: 1 },
        Chess: { first: 5, second: 3, third: 1 },
        LawnTennis: { first: 5, second: 3, third: 1 },
        Marathon: { first: 5, second: 3, third: 1 },
        Yoga: { first: 5, second: 3, third: 1 },
        Parade: { first: 10, second: 5, third: 2.5 }
      }
    };

    res.json({
      success: true,
      data: pointsSystem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching points system',
      error: error.message
    });
  }
};

// PATCH /api/leaderboard/manual - set manual points and medals for a branch
const setManualLeaderboard = async (req, res) => {
  try {
    const { branch, points, firstCount, secondCount, thirdCount } = req.body;
    if (!branch || typeof points !== 'number' || points < 0 ||
        typeof firstCount !== 'number' || firstCount < 0 ||
        typeof secondCount !== 'number' || secondCount < 0 ||
        typeof thirdCount !== 'number' || thirdCount < 0) {
      return res.status(400).json({ success: false, message: 'Invalid branch, points, or medal counts' });
    }
    await LeaderboardOverride.findOneAndUpdate(
      { branch },
      { branch, points, firstCount, secondCount, thirdCount },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Leaderboard points and medals updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update leaderboard points and medals.' });
  }
};

// Utility: Clear leaderboard by removing winners from all events
const clearLeaderboard = async (req, res) => {
  try {
    await Event.updateMany({}, { $set: { winners: [] } });
    res.json({ success: true, message: 'Leaderboard cleared. All branch points set to 0.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing leaderboard', error: error.message });
  }
};

module.exports = {
  getLeaderboard,
  getPointsSystem,
  clearLeaderboard,
  setManualLeaderboard
}; 