import express from 'express';
import { Quiz, QuizResult } from '../models/Quiz.js';
import { authenticateToken, isAdmin, isProfessor } from '../middleware/auth.js';

const router = express.Router();

// Get all quizzes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name email');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single quiz
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create quiz (professor and admin)
router.post('/', authenticateToken, isProfessor, async (req, res) => {
  try {
    const newQuiz = new Quiz({
      ...req.body,
      createdBy: req.user.id,
    });
    await newQuiz.save();
    res.json(newQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update quiz (professor and admin)
router.put('/:id', authenticateToken, isProfessor, async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete quiz (professor and admin)
router.delete('/:id', authenticateToken, isProfessor, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Submit quiz answers
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Check if user has already attempted this quiz
    const existingResult = await QuizResult.findOne({
      quiz: quiz._id,
      user: req.user.id,
    });

    if (existingResult) {
      return res.status(400).json({ error: 'You have already attempted this quiz' });
    }

    const { answers } = req.body;
    let score = 0;

    // Calculate score
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        score++;
      }
    });

    const total = quiz.questions.length;

    // Save result
    const result = new QuizResult({
      quiz: quiz._id,
      user: req.user.id,
      answers,
      score,
      total,
    });

    await result.save();
    res.json({ score, total });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user's quiz results
router.get('/:id/results', authenticateToken, async (req, res) => {
  try {
    const results = await QuizResult.find({
      quiz: req.params.id,
      user: req.user.id,
    }).populate('quiz', 'name');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all quiz results (admin only)
router.get('/results/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const results = await QuizResult.find()
      .populate('quiz', 'name')
      .populate('user', 'name email');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
