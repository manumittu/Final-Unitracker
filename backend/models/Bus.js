import mongoose from 'mongoose';

const busRouteSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
});

const busBookingSchema = new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusRoute',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seatsBooked: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

export const BusRoute = mongoose.model('BusRoute', busRouteSchema);
export const BusBooking = mongoose.model('BusBooking', busBookingSchema);
