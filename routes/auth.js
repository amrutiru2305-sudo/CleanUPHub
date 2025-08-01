const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');

// Register user (resident, admin, or worker)
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// GET all workers — for admin to assign
router.get('/workers', protect, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('name email');
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch workers', error: err.message });
  }
});

module.exports = router;
