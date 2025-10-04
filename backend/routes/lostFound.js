import express from 'express';
import LostFound from '../models/LostFound.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await LostFound.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id)
      .populate('postedBy', 'name email');
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newItem = new LostFound({
      ...req.body,
      postedBy: req.user.id,
    });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Only the poster can update
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const updatedItem = await LostFound.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Only the poster can delete
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await LostFound.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
