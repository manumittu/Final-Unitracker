import express from 'express';
import { BusRoute, BusBooking } from '../models/Bus.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all routes
router.get('/routes', authenticateToken, async (req, res) => {
  try {
    const routes = await BusRoute.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's bookings
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    
    const bookings = await BusBooking.find(query)
      .populate('route')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking
router.post('/bookings', authenticateToken, async (req, res) => {
  try {
    const { route, date, seatsBooked } = req.body;
    
    // Check if route exists and has available seats
    const busRoute = await BusRoute.findById(route);
    if (!busRoute) {
      return res.status(404).json({ msg: 'Route not found' });
    }
    
    if (busRoute.availableSeats < seatsBooked) {
      return res.status(400).json({ msg: 'Not enough seats available' });
    }
    
    const newBooking = new BusBooking({
      route,
      user: req.user.id,
      date,
      seatsBooked,
    });
    
    await newBooking.save();
    
    // Update available seats
    busRoute.availableSeats -= seatsBooked;
    await busRoute.save();
    
    res.json(newBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel booking
router.delete('/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await BusBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ msg: 'Booking already cancelled' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Restore seats
    const busRoute = await BusRoute.findById(booking.route);
    busRoute.availableSeats += booking.seatsBooked;
    await busRoute.save();
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Create route
router.post('/routes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const newRoute = new BusRoute(req.body);
    await newRoute.save();
    res.json(newRoute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
