import React from 'react';
import {
  Search, Bell, Settings, User, Eye, Pencil, Trash, ChevronDown
} from 'lucide-react';

const Dashboard = () => {
  const data = [];

  return (
    <div className="bg-[#F3F2FA] min-h-screen text-sm">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        {/* Left Section: Logo & Nav */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="" className="w-6 h-6" />
            {/* Removed the SecureVault name */}
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1">Dashboard</a>
            <a href="#" className="text-gray-500 hover:text-indigo-500">Add/Edit Password</a>
            <a href="#" className="text-gray-500 hover:text-indigo-500">GitHub Scan</a>
          </nav>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-5">
          <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
          <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
          {/* Replaced avatar with user icon */}
          <User className="w-6 h-6 text-gray-600 cursor-pointer" />
        </div>
      </header>

      {/* Main Section */}
      <main className="p-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Top Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
              Add Password
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 text-gray-600 text-xs uppercase">
                <tr>
                  {['Website', 'Username', 'Password', 'Date Added', 'Actions'].map((label, i) => (
                    <th key={i} className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span>{label}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No entries found.
                    </td>
                  </tr>
                ) : (
                  data.map((entry, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">example.com</td>
                      <td className="px-4 py-3">username</td>
                      <td className="px-4 py-3">********</td>
                      <td className="px-4 py-3">2025-05-01</td>
                      <td className="px-4 py-3 flex space-x-2">
                        <Pencil className="w-4 h-4 text-blue-500 cursor-pointer" />
                        <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, "...", 10, 11].map((pg, idx) => (
              <button
                key={idx}
                className={`w-8 h-8 rounded-full text-sm ${
                  pg === 1 ? "bg-indigo-500 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {pg}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
