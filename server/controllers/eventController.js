const Event = require('../models/Event');

// Create new event
const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Get all events with filters
const getEvents = async (req, res) => {
  try {
    const { status, branch, game } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (branch) filter.branchTags = { $in: [branch] };
    if (game) filter.gameType = game;

    const events = await Event.find(filter).sort({ day: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get single event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Update event status
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Upcoming', 'Active', 'Concluded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event,
      message: 'Event status updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating event status',
      error: error.message
    });
  }
};

// Add winners to event
const addWinners = async (req, res) => {
  try {
    const { winners, result } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Filter out any winner entries with empty/null/undefined branch
    const filteredWinners = Array.isArray(winners) ? winners.filter(w => w.branch) : [];

    // New validation: At least one winner (branch) is required for any event type
    if (filteredWinners.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least the winner branch (1st place) is required.'
      });
    }
    // Points for 1st, 2nd, and 3rd are all optional

    event.winners = filteredWinners;
    event.status = 'Concluded';
    if (typeof result === 'string') {
      event.result = result;
    }
    await event.save();

    res.json({
      success: true,
      data: event,
      message: 'Winners added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding winners',
      error: error.message
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  addWinners
}; 