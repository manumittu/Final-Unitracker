import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    timeSlot: {
      type: String,
      default: '',
    },
    foodItem: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    paymentMode: {
      type: String,
      default: 'Cash',
    },
    specialInstructions: {
      type: String,
      default: '',
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
