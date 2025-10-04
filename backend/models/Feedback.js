import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    facultyName: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comments: String,
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

export default mongoose.model('Feedback', feedbackSchema);
