import React from 'react';
import {
  Search, Pencil, Trash, ChevronDown
} from 'lucide-react';
import Header from '../components/Header';

const Dashboard = () => {
  const data = [];

  return (
    <div className="bg-white min-h-screen text-base font-inter">
      <Header />

      {/* Main Section */}
      <main className="p-6 sm:p-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400">
              + Add Password
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
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button title="Edit" className="hover:bg-blue-100 rounded-full p-1.5 transition">
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </button>
                          <button title="Delete" className="hover:bg-red-100 rounded-full p-1.5 transition">
                            <Trash className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
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
                  pg === 1
                    ? "bg-indigo-500 text-white"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
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
