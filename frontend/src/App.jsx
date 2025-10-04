import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

// Module imports
import CoursesModule from './modules/courses/CoursesModule';
import LostFoundModule from './modules/lostFound/LostFoundModule';

// Placeholder components for modules (will be created later)
const TimetableModule = () => <div className="p-8">Timetable Module - Coming Soon</div>;
const QuizModule = () => <div className="p-8">Quiz Module - Coming Soon</div>;
const FeedbackModule = () => <div className="p-8">Feedback Module - Coming Soon</div>;
const ProjectsModule = () => <div className="p-8">Projects Module - Coming Soon</div>;
const BusModule = () => <div className="p-8">Bus Reservation Module - Coming Soon</div>;
const GradeAppealModule = () => <div className="p-8">Grade Appeal Module - Coming Soon</div>;

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
