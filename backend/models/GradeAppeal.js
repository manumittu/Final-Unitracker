import mongoose from 'mongoose';

const gradeAppealSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    currentGrade: {
      type: String,
      required: true,
    },
    expectedGrade: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    adminResponse: String,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('GradeAppeal', gradeAppealSchema);
