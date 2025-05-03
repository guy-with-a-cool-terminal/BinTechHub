import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/20/solid'; // Import icons
import { useNavigate } from 'react-router-dom'; // Import navigate
import api from '../services/api';
import React, { useState } from 'react'; // Import useState

export default function SignUpForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // Error state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [emailError, setEmailError] = useState(''); // Email validation error
  const [passwordError, setPasswordError] = useState(''); // Password validation error
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // Confirm Password validation error

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  const validateForm = () => {
    let valid = true;
    // Reset errors before validation
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    // Password validation (simple check)
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      valid = false;
    }

    return valid;
  };

  const handleSignUp = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Validate the form
    if (!validateForm()) return;

    setIsLoading(true); // Set loading state

    try {
      // Call the sign-up function from api.js
      await api.signUp(email, password);
      navigate('/login'); // Redirect to the login page after successful signup
    } catch (error) {
      // Handle signup errors
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-white"></div>

      {/* Sign-Up Form Card */}
      <div className="relative bg-white p-10 rounded-3xl shadow-xl w-full max-w-md mx-auto z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6">Create Account</h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6">Manage and secure your passwords effortlessly.</p>

        {/* Error message for form submission */}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSignUp}>
          {/* Email Input */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email address"
                className={`w-full pl-10 pr-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${emailError && 'border-red-500'}`}
                required
              />
            </div>
            {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${passwordError && 'border-red-500'}`}
                required
              />
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
          </div>

          {/* Confirm Password Input */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full pl-10 pr-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${confirmPasswordError && 'border-red-500'}`}
                required
              />
            </div>
            {confirmPasswordError && <p className="text-red-500 text-sm mt-2">{confirmPasswordError}</p>}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition transform duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* Switch to Login Link */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-600">
          Already have an account?{' '}
          <a href="#" onClick={handleSwitchToLogin} className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
