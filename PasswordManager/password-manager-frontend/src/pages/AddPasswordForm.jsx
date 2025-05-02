import React, { useState } from "react";

const AddPasswordForm = () => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-8">Add Password</h1>
      <form className="w-full max-w-2xl bg-white p-8 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="My New Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <input
              type="text"
              placeholder="https://www.example.com"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="myusername"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={password}
                onChange={handlePasswordChange}
                placeholder="myS3cur3P@ssw0rd"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="button"
                onClick={generatePassword}
                className="bg-violet-500 text-white px-3 py-2 rounded hover:bg-violet-600"
              >
                GENERATOR
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Password strength</div>
            <div className="w-full h-1 bg-gray-200 rounded mt-1">
              <div className={`h-1 rounded transition-all ${strengthBarClass}`}></div>
            </div>
            <div className="text-xs mt-1 text-gray-500 flex gap-3">
              <span>Weak</span>
              <span>Moderate</span>
              <span>Strong</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="bg-violet-500 text-white px-6 py-2 rounded hover:bg-violet-600"
          >
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPasswordForm;
