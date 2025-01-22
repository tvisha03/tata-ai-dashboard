const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock User Database
const users = [];

// User Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = { username, email, password: hashedPassword };
  users.push(newUser);

  const token = jwt.sign({ email: newUser.email }, 'secret', { expiresIn: 3600 });
  res.json({ token });
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: 3600 });
  res.json({ token });
});

module.exports = router;
