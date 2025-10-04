import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../utils/AuthContext';
import { FaArrowLeft, FaHome, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const ModuleLayout = ({ title, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-blue-600">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <FaHome className="mr-2" />
                  Dashboard
                </Button>
              </Link>

              <div className="flex items-center space-x-2">
                <FaUserCircle size={20} className="text-gray-600" />
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default ModuleLayout;
