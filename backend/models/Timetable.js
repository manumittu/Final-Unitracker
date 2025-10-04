import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    classrooms: {
      type: Number,
      required: true,
    },
    subjectMap: {
      type: Map,
      of: [String],
      required: true,
    },
    timetable: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Timetable', timetableSchema);
