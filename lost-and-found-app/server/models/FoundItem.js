const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  // Finder Details
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
  dateFound: {
    type: Date,
    required: true
  },
  locationFound: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Claimed'],
    default: 'Pending'
  },
  
  // Reference to matched lost item
  matchedLostItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LostItem'
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
foundItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FoundItem', foundItemSchema);