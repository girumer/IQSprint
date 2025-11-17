const express = require('express');
const User = require('../models/users');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Add coin (protected)
router.post('/user/add-coin', authMiddleware, async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.coins += 1;
    await user.save();

    res.json({ msg: 'Coin added', coins: user.coins });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get coins (protected)
router.get('/user/coin', authMiddleware, async (req, res) => {
  const phoneNumber = req.query.phoneNumber?.trim();
  const user = await User.findOne({ phoneNumber });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ coins: user.coins });
});

// Register user
router.post('/register', async (req, res) => {
  const { phoneNumber, password } = req.body;

  const existing = await User.findOne({ phoneNumber });
  if (existing) return res.status(400).json({ error: 'Phone number already registered' });

  const adminNumbers = ['0932157512', '0911547552'];
  const role = adminNumbers.includes(phoneNumber) ? 'admin' : 'user';

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ phoneNumber, password: hashedPassword, role });
  await user.save();

  res.status(201).json({ msg: 'User registered successfully', user });
});

// Login user
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = await User.findOne({ phoneNumber });

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
console.log("JWT_SECRET:", process.env.JWT_SECRET);

  const token = jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
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
// Get all users (protected, admin only)
router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const users = await User.find();
  res.json(users);
});

module.exports = router;
