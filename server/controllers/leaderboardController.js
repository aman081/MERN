const Event = require('../models/Event');

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
        Athletics: { first: 5, second: 3, third: 1 }
      },
      Girls: {
        Cricket: { first: 5, second: 3, third: 1 },
        Football: { first: 7, second: 4, third: 2 },
        Basketball: { first: 6, second: 3, third: 1 },
        Volleyball: { first: 5, second: 3, third: 1 },
        Badminton: { first: 4, second: 2, third: 1 },
        TableTennis: { first: 3, second: 2, third: 1 },
        Athletics: { first: 5, second: 3, third: 1 }
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

module.exports = {
  getLeaderboard,
  getPointsSystem
}; 