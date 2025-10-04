import express from 'express';
import Appeal from '../models/Appeal.js';
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try {
    const a = new Appeal(req.body);
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all (with optional query ?q=searchTerm for studentId or courseCode)
router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    let list;
    if (q) {
      const re = new RegExp(q, 'i');
      list = await Appeal.find({ $or: [{ studentId: re }, { courseCode: re }] }).sort({ createdAt: -1 });
    } else {
      list = await Appeal.find().sort({ createdAt: -1 });
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const item = await Appeal.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Appeal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Appeal.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
