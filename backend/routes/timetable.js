import express from 'express';
import Timetable from '../models/Timetable.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get timetable
router.get('/', authenticateToken, async (req, res) => {
  try {
    const timetable = await Timetable.findOne().sort({ createdAt: -1 });
    res.json(timetable || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save/Update timetable (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Delete existing timetable
    await Timetable.deleteMany({});
    
    const newTimetable = new Timetable({
      ...req.body,
      createdBy: req.user.id,
    });
    
    await newTimetable.save();
    res.json(newTimetable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete timetable (admin only)
router.delete('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Timetable.deleteMany({});
    res.json({ message: 'Timetable deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
