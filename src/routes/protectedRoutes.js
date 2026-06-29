const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const User = require('../models/User');

// ─── User route — any logged in user ─────────────────────────
router.get('/user/profile', verifyToken, async (req, res) => {
  try {
    // req.user.id comes from the JWT payload set by authMiddleware
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Admin routes — only admin role ──────────────────────────
router.get('/admin/users', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');//he - prefix means exclude these fields. So MongoDB returns everything except password and refreshToken. Never send these to the client.
    res.status(200).json({
      message: 'All users fetched',
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/admin/users/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;