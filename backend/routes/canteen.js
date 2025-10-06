import express from 'express';
import Menu from '../models/Menu.js';
import Booking from '../models/Booking.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Menu routes
router.get('/menu', authenticateToken, async (req, res) => {
  try {
    // Sort by category first, then by itemName
    const menu = await Menu.find().sort({ category: 1, itemName: 1 });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/menu', authenticateToken, isAdmin, async (req, res) => {
  try {
    const menuItem = new Menu(req.body);
    await menuItem.save();
    res.json(menuItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/menu/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/menu/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Booking routes
router.get('/booking', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/booking', authenticateToken, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user.id,
    });
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/booking/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Only the booking owner or admin can update
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/booking/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Only the booking owner or admin can delete
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
