import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import GradeForm from './components/GradeForm';
import Dashboard from './components/Dashboard';
import './components/form.css';

function App(){
  return (
    <div>
      <nav className="topbar">
        <div className="container">
          <h2>UniTracker - Grade Appeals</h2>
          <div className="navlinks">
            <Link to="/">Home</Link>
            <Link to="/form">Submit Appeal</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<div className="hero container"><h1>Welcome to UniTracker</h1><p>Submit or manage grade appeals</p></div>} />
        <Route path="/form" element={<GradeForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <footer className="footer container">
        &copy; 2025 UniTracker
      </footer>
    </div>
  );
}

export default App;
