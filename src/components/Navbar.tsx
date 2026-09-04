import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#FFF9F2] border-b border-[#F5E6D3] text-gray-900 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-[#EC4899]" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">Virtusscholar</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0D9488] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-gray-600 hover:text-[#0D9488] transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium bg-[#0D9488] hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
