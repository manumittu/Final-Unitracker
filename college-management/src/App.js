import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./App.css";
import { FaUserGraduate, FaChalkboardTeacher, FaTools, FaUtensils, FaBus } from "react-icons/fa";
import Auth from "./Auth";

function App() {
  const features = [
    { icon: <FaUserGraduate size={40} />, title: "Student Dashboard", text: "Access courses, attendance, and grades in one place." },
    { icon: <FaChalkboardTeacher size={40} />, title: "Faculty Portal", text: "Manage course material, attendance, and assessments easily." },
    { icon: <FaTools size={40} />, title: "Admin Tools", text: "Handle user roles, generate reports, and configure schedules." },
    { icon: <FaUtensils size={40} />, title: "Canteen Booking", text: "Reserve meals or snacks in advance and avoid long queues." },
    { icon: <FaBus size={40} />, title: "Bus Booking", text: "Book transportation for college routes with ease and transparency." },
  ];

  return (
    <Routes>
      {/* Landing page */}
      <Route
        path="/"
        element={
          <div className="landing-container light">
            <header className="hero">
              <h1>Welcome to UniTracker</h1>
              <h2>Track. Manage. Succeed.</h2>
              <p>Simplify college management for students, faculty, and admin.</p>
              <Link to="/auth" className="cta-button">Login / Sign Up</Link>
            </header>

            <section id="features" className="features">
              <h2>Key Features</h2>
              <div className="scroll-container">
                <div className="scroll-content">
                  {[...Array(2)].flatMap(() => features).map((feature, idx) => (
                    <div className="feature-card" key={idx}>
                      {feature.icon}
                      <h3>{feature.title}</h3>
                      <p>{feature.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="cta-section">
              <h2>Ready to streamline your college operations?</h2>
              <p>Get started with our smart management system today.</p>
              <Link to="/auth" className="cta-button">Get Started</Link>
            </section>

            <footer className="footer">
              <p>&copy; 2025 UniTracker. All rights reserved.</p>
            </footer>
          </div>
        }
      />

      {/* Authentication page */}
      <Route path="/auth" element={<Auth />} />

     
    </Routes>
  );
}

export default App;
