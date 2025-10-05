import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: String,
        options: [String],
        correct: Number,
      },
    ],
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

const quizResultSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: {
      type: Map,
      of: Number,
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
