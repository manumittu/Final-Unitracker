import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  FaCalendarAlt,
  FaQuestionCircle,
  FaComments,
  FaSearchLocation,
  FaLightbulb,
  FaBus,
  FaExclamationTriangle,
  FaBook,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa';

const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Module configuration with role-based access
  const modules = [
    {
      id: 'timetable',
      title: 'Timetable Management',
      description: isAdmin() 
        ? 'Create and edit timetables' 
        : 'View your timetable',
      icon: <FaCalendarAlt size={40} />,
      path: '/modules/timetable',
      color: 'from-blue-500 to-blue-600',
      access: ['admin', 'student', 'professor'],
    },
    {
      id: 'quiz',
      title: 'Quiz Management',
      description: (isAdmin() || user?.role === 'professor')
        ? 'Create quizzes and view results'
        : 'Attend quizzes and view your results',
      icon: <FaQuestionCircle size={40} />,
      path: '/modules/quiz',
      color: 'from-purple-500 to-purple-600',
      access: ['admin', 'student', 'professor'],
    },
    {
      id: 'feedback',
      title: 'Faculty Feedback',
      description: isAdmin()
        ? 'View all feedback submitted'
        : 'Submit feedback for faculty',
      icon: <FaComments size={40} />,
      path: '/modules/feedback',
      color: 'from-green-500 to-green-600',
      access: ['admin', 'student', 'professor'],
    },
    {
      id: 'lost-found',
      title: 'Lost and Found',
      description: 'Report lost items or claim found items',
      icon: <FaSearchLocation size={40} />,
      path: '/modules/lost-found',
      color: 'from-orange-500 to-orange-600',
      access: ['admin', 'student', 'professor'],
    },
    {
      id: 'projects',
      title: 'Project Ideas',
      description: isAdmin()
        ? 'Approve/reject project submissions'
        : 'Submit your project ideas',
      icon: <FaLightbulb size={40} />,
      path: '/modules/projects',
      color: 'from-yellow-500 to-yellow-600',
      access: ['admin', 'student', 'professor'],
    },
    {
      id: 'bus',
      title: 'Bus Reservation',
      description: isAdmin() 
        ? 'Manage routes and view all bookings' 
        : 'Reserve bus tickets and view bookings',
      icon: <FaBus size={40} />,
      path: '/modules/bus',
      color: 'from-red-500 to-red-600',
      access: ['admin', 'student', 'professor'],
    },
    {
      id: 'grade-appeal',
      title: 'Grade Appeals',
      description: isAdmin()
        ? 'View and respond to grade appeals'
        : 'Submit grade appeal requests',
      icon: <FaExclamationTriangle size={40} />,
      path: '/modules/grade-appeal',
      color: 'from-pink-500 to-pink-600',
      access: ['admin', 'student', 'professor'],
    },
    {
      id: 'courses',
      title: 'Course Management',
      description: isAdmin()
        ? 'Full CRUD access to courses'
        : 'View available courses',
      icon: <FaBook size={40} />,
      path: '/modules/courses',
      color: 'from-indigo-500 to-indigo-600',
      access: ['admin', 'student', 'professor'],
    },
  ];

  // Filter modules based on user role
  const accessibleModules = modules.filter((module) =>
    module.access.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-blue-600">UniTracker</h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUserCircle size={24} className="text-gray-600" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Select a module below to get started
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accessibleModules.map((module) => (
            <Link key={module.id} to={module.path}>
              <Card className="h-full hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-2 hover:border-primary">
                <CardHeader className={`bg-gradient-to-r ${module.color} text-white rounded-t-lg`}>
                  <div className="flex justify-center mb-2">
                    {module.icon}
                  </div>
                  <CardTitle className="text-center text-xl">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-center text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
