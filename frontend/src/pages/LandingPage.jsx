import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaTools, 
  FaUtensils, 
  FaBus 
} from 'react-icons/fa';

const LandingPage = () => {
  const features = [
    { 
      icon: <FaUserGraduate size={40} />, 
      title: "Student Dashboard", 
      text: "Access courses, attendance, and grades in one place." 
    },
    { 
      icon: <FaChalkboardTeacher size={40} />, 
      title: "Faculty Portal", 
      text: "Manage course material, attendance, and assessments easily." 
    },
    { 
      icon: <FaTools size={40} />, 
      title: "Admin Tools", 
      text: "Handle user roles, generate reports, and configure schedules." 
    },
    { 
      icon: <FaUtensils size={40} />, 
      title: "Canteen Booking", 
      text: "Reserve meals or snacks in advance and avoid long queues." 
    },
    { 
      icon: <FaBus size={40} />, 
      title: "Bus Booking", 
      text: "Book transportation for college routes with ease and transparency." 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Welcome to UniTracker
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Track. Manage. Succeed.
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Simplify college management for students, faculty, and admin.
          </p>
          <Link 
            to="/auth" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Login / Sign Up
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Key Features
          </h2>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to streamline your college operations?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Get started with our smart management system today.
          </p>
          <Link 
            to="/auth" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 UniTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
