import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

// Module imports
import CoursesModule from './modules/courses/CoursesModule';
import LostFoundModule from './modules/lostFound/LostFoundModule';
import FeedbackModule from './modules/feedback/FeedbackModule';
import ProjectsModule from './modules/projects/ProjectsModule';
import GradeAppealModule from './modules/gradeAppeal/GradeAppealModule';
import TimetableModule from './modules/timetable/TimetableModule';
import QuizModule from './modules/quiz/QuizModule';
import BusModule from './modules/bus/BusModule';
import CanteenModule from './modules/canteen/CanteenModule';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      
      {/* Module Routes */}
      <Route
        path="/modules/timetable"
        element={
          <ProtectedRoute>
            <TimetableModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/quiz"
        element={
          <ProtectedRoute>
            <QuizModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/feedback"
        element={
          <ProtectedRoute>
            <FeedbackModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/lost-found"
        element={
          <ProtectedRoute>
            <LostFoundModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/projects"
        element={
          <ProtectedRoute>
            <ProjectsModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/bus"
        element={
          <ProtectedRoute>
            <BusModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/grade-appeal"
        element={
          <ProtectedRoute>
            <GradeAppealModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/courses"
        element={
          <ProtectedRoute>
            <CoursesModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/canteen"
        element={
          <ProtectedRoute>
            <CanteenModule />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
