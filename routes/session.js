import express from 'express';
import mongoose from 'mongoose';
import Session from '../models/Session.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join('uploads', 'physiological');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/sessions - Create a new session
router.post('/', upload.single('excelFile'), async (req, res) => {
  try {
    const {
      user,
      patient,
      sessionID,
      sessionType,
      sessionDate,
      painLevel,
      mobilityAssessment,
      treatmentProvided,
      prescribedExercise
    } = req.body;

    // Validate required fields
    if (!user || !patient || !sessionID || !sessionType || !sessionDate || painLevel === undefined || !mobilityAssessment || !treatmentProvided || !prescribedExercise) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionData = {
      user,
      patient,
      sessionID,
      sessionType,
      sessionDate: new Date(sessionDate),
      painLevel,
      mobilityAssessment,
      treatmentProvided,
      prescribedExercise
    };

    if (req.file) {
      sessionData.physiologicalFile = req.file.path;
    }

    const session = new Session(sessionData);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

export default router;