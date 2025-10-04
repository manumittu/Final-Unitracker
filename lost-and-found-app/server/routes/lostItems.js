const express = require('express');
const multer = require('multer');
const path = require('path');
const LostItem = require('../models/LostItem');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/lost-items/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET /api/lost-items - Get all lost items
router.get('/', async (req, res) => {
  try {
    const lostItems = await LostItem.find().sort({ createdAt: -1 });
    res.json(lostItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/lost-items/:id - Get single lost item
router.get('/:id', async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }
    res.json(lostItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/lost-items - Create new lost item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const lostItemData = {
      ...req.body,
      image: req.file ? req.file.path : null
    };

    const lostItem = new LostItem(lostItemData);
    const savedItem = await lostItem.save();
    
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/lost-items/:id - Update lost item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const lostItem = await LostItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    res.json(lostItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/lost-items/:id - Delete lost item
router.delete('/:id', async (req, res) => {
  try {
    const lostItem = await LostItem.findByIdAndDelete(req.params.id);
    
    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    res.json({ message: 'Lost item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;