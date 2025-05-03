import React, { useState } from "react";
import Header from '../components/Header';

const AddPassword = () => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setPassword(newPass);
    setStrength(getPasswordStrength(newPass));
  };

  const generateRandomPassword = (length = 12) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const generatePassword = () => {
    const newPass = generateRandomPassword();
    setPassword(newPass);
    setStrength(getPasswordStrength(newPass));
  };

  const strengthBarClass = [
    "w-1/4 bg-red-500",
    "w-2/4 bg-yellow-500",
    "w-3/4 bg-blue-500",
    "w-full bg-green-500",
  ][strength - 1] || "w-0";

  return (
    <div className="bg-white min-h-screen">
      {/* Reusable Header Component */}
      <Header />

      <div className="flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Add New Password</h1>
        
        <form className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="My New Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Site Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
              <input
                type="text"
                placeholder="https://www.example.com"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="myusername"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="myS3cur3P@ssw0rd"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Generate
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              <div className="text-xs text-gray-500 mt-2">Password Strength</div>
              <div className="w-full h-2 bg-gray-200 rounded mt-1">
                <div className={`h-2 rounded transition-all ${strengthBarClass}`}></div>
              </div>
              <div className="text-xs mt-1 text-gray-500 flex justify-between">
                <span>Weak</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Save Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPassword;
