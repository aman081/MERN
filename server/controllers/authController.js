const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin user (assuming admin uses username instead of email)
    const admin = await User.findOne({ 
      $or: [{ email: username }, { email: username.toLowerCase() }],
      role: 'admin' 
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role
        }
      },
      message: 'Admin login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Public user login
const publicLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find public user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'public'
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  adminLogin,
  publicLogin,
  getCurrentUser
}; 