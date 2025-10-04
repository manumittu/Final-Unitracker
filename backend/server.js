import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import timetableRoutes from './routes/timetable.js';
import quizRoutes from './routes/quizzes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'UniTracker API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/quizzes', quizRoutes);

// TODO: Add remaining routes
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/lost-found', lostFoundRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/bus', busRoutes);
// app.use('/api/grade-appeals', gradeAppealRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
