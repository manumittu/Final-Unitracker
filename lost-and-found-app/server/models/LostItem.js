const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  // Reporter Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  studentStaffId: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Student', 'Staff', 'Visitor']
  },
  
  // Item Details
  itemType: {
    type: String,
    required: true,
    enum: ['Wallet', 'ID Card', 'Books', 'Electronics', 'Other']
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  image: {
    type: String, // File path
  },
  
  // Location & Status
  dateLost: {
    type: Date,
    required: true
  },
  locationLost: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Returned'],
    default: 'Pending'
  },
  additionalNotes: {
    type: String,
    trim: true
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
lostItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('LostItem', lostItemSchema);