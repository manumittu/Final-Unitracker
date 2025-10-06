import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      // Admins are auto-approved, others need approval
      status: role === 'admin' ? 'approved' : 'pending',
    });

    await newUser.save();

    // Different messages based on role
    if (role === 'admin') {
      res.json({ msg: 'Admin account registered successfully. You can now login.' });
    } else {
      res.json({ 
        msg: 'Access request submitted successfully. Please wait for admin approval to login.',
        status: 'pending'
      });
    }
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Check if user account is approved
    if (user.status === 'pending') {
      return res.status(403).json({ 
        msg: 'Your account is pending admin approval. Please wait for approval before logging in.',
        status: 'pending'
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ 
        msg: 'Your account request has been rejected by the admin.',
        status: 'rejected'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all access requests (pending users)
router.get('/access-requests', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const requests = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Approve or reject access request
router.put('/access-requests/:userId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const { userId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status. Must be "approved" or "rejected".' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Don't allow changing admin status
    if (user.role === 'admin') {
      return res.status(400).json({ msg: 'Cannot modify admin user status' });
    }

    user.status = status;
    await user.save();

    res.json({ 
      msg: `User access ${status}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
