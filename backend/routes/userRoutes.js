const express = require('express');
const User = require('../models/users');
const authMiddleware = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PHONE_PATTERN = /^0[79]\d{8}$/;
const ADMIN_NUMBERS = ['0932157512', '0911547552'];

// Get the logged-in user's coins (phone number comes from the login token)
router.get('/user/coin', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.user.phoneNumber }).select('coins').lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ coins: user.coins || 0 });
  } catch (err) {
    console.error('Error fetching coins:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const phoneNumber = String(req.body.phoneNumber || '').trim();
    const password = String(req.body.password || '');

    if (!PHONE_PATTERN.test(phoneNumber)) {
      return res.status(400).json({ error: 'Enter a 10-digit phone number that starts with 09 or 07.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Use a password with at least 6 characters.' });
    }

    const existing = await User.findOne({ phoneNumber }).lean();
    if (existing) return res.status(400).json({ error: 'This phone number already has an account. Log in instead.' });

    const role = ADMIN_NUMBERS.includes(phoneNumber) ? 'admin' : 'user';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ phoneNumber, password: hashedPassword, role });

    res.status(201).json({
      msg: 'User registered successfully',
      user: { _id: user._id, phoneNumber: user.phoneNumber, role: user.role },
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const phoneNumber = String(req.body.phoneNumber || '').trim();
    const password = String(req.body.password || '');
    const user = await User.findOne({ phoneNumber });

    if (!user) return res.status(401).json({ error: 'Wrong phone number or password.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Wrong phone number or password.' });

    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: 'Login successful',
      token,
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Get all users (admin only)
router.get('/users', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json(users);
  } catch (err) {
    console.error('Error listing users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
