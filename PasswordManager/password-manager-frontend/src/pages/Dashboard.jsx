import React, { useState, useEffect } from 'react';
import { Search, Pencil, Trash, ChevronDown, MoreVertical } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openActionIndex, setOpenActionIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPasswords = async () => {
      setLoading(true);
      try {
        const response = await api.getPasswords(currentPage);
        setPasswords(response.results);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error('Error fetching passwords:', error);
      }
      setLoading(false);
    };
    fetchPasswords();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleActions = (index) => {
    setOpenActionIndex(openActionIndex === index ? null : index);
  };

  const handleEdit = (id) => {
    console.log('Edit password with ID:', id);
    // Example: navigate(`/editpassword/${id}`);
  };

  const handleDelete = (id) => {
    console.log('Delete password with ID:', id);
    // Add delete logic here
  };

  return (
    <div className="bg-white min-h-screen text-base font-inter">
      <Header />

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
            <button
              onClick={() => navigate('/addpassword')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              + Add Password
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left relative z-0">
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td>
                  </tr>
                ) : passwords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">No entries found.</td>
                  </tr>
                ) : (
                  passwords.map((entry, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 relative">
                      <td className="px-4 py-3">{entry.website}</td>
                      <td className="px-4 py-3">{entry.username}</td>
                      <td className="px-4 py-3">********</td>
                      <td className="px-4 py-3">{entry.date_added}</td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            onClick={() => toggleActions(index)}
                            className="hover:bg-gray-100 rounded-full p-1.5 transition"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>

                          {openActionIndex === index && (
                            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-md z-20">
                              <button
                                onClick={() => handleEdit(entry.id)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Pencil className="w-4 h-4 text-blue-500" /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Trash className="w-4 h-4 text-red-500" /> Delete
                              </button>
                            </div>
                          )}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => handlePageChange(pg)}
                className={`w-8 h-8 rounded-full text-sm ${
                  pg === currentPage
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
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
