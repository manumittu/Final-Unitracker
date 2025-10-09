import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
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
  FaUtensils,
  FaUserCheck,
  FaMoon,
  FaSun,
} from 'react-icons/fa';

const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    {
      id: 'canteen',
      title: 'Canteen Management',
      description: isAdmin()
        ? 'Manage menu items and view all orders'
        : 'Order food from canteen',
      icon: <FaUtensils size={40} />,
      path: '/modules/canteen',
      color: 'from-teal-500 to-teal-600',
      access: ['admin', 'student', 'professor', 'canteen'],
    },
    {
      id: 'access-requests',
      title: 'Access Requests',
      description: 'Approve or reject user access requests',
      icon: <FaUserCheck size={40} />,
      path: '/modules/access-requests',
      color: 'from-cyan-500 to-cyan-600',
      access: ['admin'],
    },
  ];

  // Filter modules based on user role
  const accessibleModules = modules.filter((module) =>
    module.access.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                UniTracker
              </h1>
            </Link>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <FaMoon className="text-blue-600" /> : <FaSun className="text-yellow-400" />}
                <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
              </Button>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FaUserCircle size={24} className="text-blue-600 dark:text-blue-400" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 transition-colors"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select a module below to get started with your university activities
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accessibleModules.map((module) => (
            <Link key={module.id} to={module.path}>
              <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer border-2 hover:border-primary dark:bg-gray-800/80 dark:border-gray-700 dark:hover:border-primary backdrop-blur-sm">
                <CardHeader className={`bg-gradient-to-r ${module.color} text-white rounded-t-lg p-6 shadow-md`}>
                  <div className="flex justify-center mb-3 transform transition-transform duration-300 hover:scale-110">
                    {module.icon}
                  </div>
                  <CardTitle className="text-center text-xl font-bold">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <CardDescription className="text-center text-gray-600 dark:text-gray-300 leading-relaxed">
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
