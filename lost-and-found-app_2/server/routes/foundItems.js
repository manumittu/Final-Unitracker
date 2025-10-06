const express = require('express');
const multer = require('multer');
const path = require('path');
const FoundItem = require('../models/FoundItem');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/found-items/');
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

// GET /api/found-items - Get all found items
router.get('/', async (req, res) => {
  try {
    const foundItems = await FoundItem.find()
      .populate('matchedLostItemId')
      .sort({ createdAt: -1 });
    res.json(foundItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/found-items/:id - Get single found item
router.get('/:id', async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id)
      .populate('matchedLostItemId');
    
    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }
    res.json(foundItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/found-items - Create new found item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const foundItemData = {
      ...req.body,
      image: req.file ? req.file.path : null
    };

    const foundItem = new FoundItem(foundItemData);
    const savedItem = await foundItem.save();
    
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/found-items/:id - Update found item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const foundItem = await FoundItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('matchedLostItemId');

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    res.json(foundItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/found-items/:id - Delete found item
router.delete('/:id', async (req, res) => {
  try {
    const foundItem = await FoundItem.findByIdAndDelete(req.params.id);
    
    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    res.json({ message: 'Found item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;