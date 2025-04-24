import React, { useState } from 'react';

// Input Component
function Input({ type, placeholder, className, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      value={value}
      onChange={onChange}
    />
  );
}

// Button Component
function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      {children}
    </button>
  );
}

const sampleUsers = [
  { name: 'Elizabeth Bailey', date: '2023-01-15', status: 'Active' },
  { name: 'Jason Howard', date: '2023-09-02', status: 'Inactive' },
  { name: 'Sarah Johnson', date: '2023-06-21', status: 'Active' },
  { name: 'Tina Taylor', date: '2023-07-11', status: 'Active' },
  { name: 'Jordan Clark', date: '2023-08-05', status: 'Inactive' },
];

export default function Users() {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState(sampleUsers);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Filter users as you type
    const filtered = sampleUsers.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.date.includes(value)
    );
    setUsers(filtered);
  };

  return (
    <div className="flex justify-center items-start bg-gray-100 py-6 px-4 min-h-screen">
      <div className="bg-white rounded-md shadow-md w-full max-w-4xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
        <div className="flex items-center gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search users..."
            className="flex-grow"
            value={searchText}
            onChange={handleSearchChange}
          />
          <Button onClick={() => {}}>Search</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 text-sm font-medium text-gray-600">Name</th>
                <th className="py-2 text-sm font-medium text-gray-600">Registration Date</th>
                <th className="py-2 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-sm">{user.name}</td>
                    <td className="py-2 text-sm">{user.date}</td>
                    <td className="py-2 text-sm">
                      <span
                        className={
                          user.status === 'Active'
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
