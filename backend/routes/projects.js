import express from 'express';
import Project from '../models/Project.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show own projects
    if (req.user.role !== 'admin') {
      query.submittedBy = req.user.id;
    }
    
    const projects = await Project.find(query)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single project
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('submittedBy', 'name email');
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && project.submittedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newProject = new Project({
      ...req.body,
      submittedBy: req.user.id,
    });
    await newProject.save();
    res.json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update project status (admin only)
router.put('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, feedback } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status, feedback },
      { new: true }
    ).populate('submittedBy', 'name email');
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
