import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-full font-bold text-sm">
            🔐
          </div>
          <span className="text-indigo-600 font-semibold hidden sm:block">SecureVault</span>
        </div>
        <nav className="hidden sm:flex space-x-6">
          <Link
            to="/dashboard"
            className={`${
              location.pathname === '/dashboard'
                ? 'text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/addpassword"
            className={`${
              location.pathname === '/addpassword'
                ? 'text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            Add/Edit Password
          </Link>
          <Link
            to="/githubscan"
            className={`${
              location.pathname === '/githubscan'
                ? 'text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            GitHub Scan
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
        <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
        <User className="w-6 h-6 text-gray-600 cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
