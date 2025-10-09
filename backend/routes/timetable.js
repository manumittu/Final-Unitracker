import express from 'express';
import Timetable from '../models/Timetable.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Default timetable structure
const getDefaultTimetable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00'];
  const schedule = {};
  
  days.forEach(day => {
    schedule[day] = {};
    timeSlots.forEach(slot => {
      // Mark lunch break slot
      if (slot === '12:00-1:00') {
        schedule[day][slot] = { 
          subject: 'LUNCH BREAK', 
          teacher: '', 
          room: '',
          isBreak: true 
        };
      } else {
        schedule[day][slot] = { 
          subject: '', 
          teacher: '', 
          room: '',
          isBreak: false 
        };
      }
    });
  });
  
  return {
    schedule,
    timeSlots
  };
};

// Get timetable
router.get('/', authenticateToken, async (req, res) => {
  try {
    let timetable = await Timetable.findOne().sort({ createdAt: -1 });
    
    // If no timetable exists, return default structure
    if (!timetable) {
      const defaultData = getDefaultTimetable();
      res.json(defaultData);
    } else {
      res.json(timetable);
    }
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
