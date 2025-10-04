import express from 'express';
import GradeAppeal from '../models/GradeAppeal.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all appeals
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show own appeals
    if (req.user.role !== 'admin') {
      query.submittedBy = req.user.id;
    }
    
    const appeals = await GradeAppeal.find(query)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(appeals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single appeal
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appeal = await GradeAppeal.findById(req.params.id)
      .populate('submittedBy', 'name email');
    
    if (!appeal) {
      return res.status(404).json({ msg: 'Appeal not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && appeal.submittedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(appeal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit appeal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newAppeal = new GradeAppeal({
      ...req.body,
      submittedBy: req.user.id,
    });
    await newAppeal.save();
    res.json(newAppeal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update appeal status (admin only)
router.put('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    
    const appeal = await GradeAppeal.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    ).populate('submittedBy', 'name email');
    
    if (!appeal) {
      return res.status(404).json({ msg: 'Appeal not found' });
    }
    
    res.json(appeal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
