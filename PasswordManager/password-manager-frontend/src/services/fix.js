import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/20/solid'; // Import icons
import { useNavigate } from 'react-router-dom'; // import navigate
import { useState } from 'react'; // Import useState
import api from '../services/api'; // Import the API service

export default function SignUpForm() {
  const navigate = useNavigate();

  // State for form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // Error state

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  // Handle form submission
  const handleSignUp = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      // Call the sign-up function from api.js
      await api.signUp(email, password);
      navigate('/login'); // Redirect to the login page after successful signup
    } catch (error) {
      // Handle signup errors
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Blurred Background Images */}
      <div
        className="fixed top-0 left-0 w-1/3 h-full bg-cover bg-center blur-lg"
        style={{ backgroundImage: 'url(/images/blurred-left.jpg)' }}
      ></div>
      <div
        className="fixed top-0 right-0 w-1/3 h-full bg-cover bg-center blur-lg"
        style={{ backgroundImage: 'url(/images/blurred-right.jpg)' }}
      ></div>

      <div className="relative bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center z-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create Account</h2>
        <p className="text-sm text-gray-600 mb-6">Sign up to access the network</p>
        {error && (
          <div className="mb-4 text-red-500">{error}</div> // Display error if signup fails
        )}
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                placeholder="Your Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="#"
            onClick={handleSwitchToLogin}
            className="text-blue-500 hover:underline"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
