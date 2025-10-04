import express from 'express';
import Feedback from '../models/Feedback.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all feedback (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit feedback
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newFeedback = new Feedback({
      ...req.body,
      submittedBy: req.user.id,
    });
    await newFeedback.save();
    res.json(newFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
