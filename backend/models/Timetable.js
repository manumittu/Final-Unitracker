import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    classrooms: {
      type: Number,
      required: false,
    },
    subjectMap: {
      type: Map,
      of: [String],
      required: false,
    },
    timetable: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: false,
    },
    schedule: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: false,
    },
    timeSlots: {
      type: [String],
      default: ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Timetable', timetableSchema);
