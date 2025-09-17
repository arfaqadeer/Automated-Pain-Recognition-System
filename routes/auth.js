import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, clinicName, phone, acceptTerms } = req.body;
    if (!firstName || !lastName || !email || !password || acceptTerms !== true) {
      return res.status(400).json({ message: 'All required fields must be filled and terms accepted.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword, clinicName, phone, acceptTerms });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.status(201).json({ message: 'User registered successfully.', token, user: { firstName, lastName, email, clinicName, phone } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful.', token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email, clinicName: user.clinicName, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router; 