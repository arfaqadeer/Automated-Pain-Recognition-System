import express from 'express';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT and set req.userId
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Add a new patient
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const {
      firstName, lastName, age, condition, primaryCondition, additionalNotes, status,
      contact, email, nextAppointment, dateOfBirth, gender, address,
      emergencyContactName, emergencyContactRelationship, emergencyContactNo
    } = req.body;
    // Generate a unique patientID
    const patientID = `PAT-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const now = new Date();
    const patient = new Patient({
      user: user._id,
      firstName, lastName, age, condition, primaryCondition, additionalNotes, status,
      contact, email, nextAppointment, dateOfBirth, gender, address,
      emergencyContactName, emergencyContactRelationship, emergencyContactNo,
      patientID,
      startDate: now,
      lastVisit: now,
      noOfSessions: 0
    });
    await patient.save();
    user.patients.push(patient._id);
    user.noOfPatients += 1;
    if (status === 'active') user.activeCases += 1;
    if (status === 'pending') user.pendingReviews += 1;
    await user.save();
    res.status(201).json({ message: 'Patient added', patient });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all patients for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const patients = await Patient.find({ user: req.userId });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get a single patient by ID for the logged-in user
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, user: req.userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 