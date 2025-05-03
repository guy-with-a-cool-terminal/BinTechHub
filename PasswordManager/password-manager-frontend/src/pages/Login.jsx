import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/20/solid'; // Import icons
import { useNavigate } from 'react-router-dom'; // import navigate
import api from '../services/api';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();

  // state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(''); // Email validation error
  const [passwordError, setPasswordError] = useState(''); // Password validation error
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSwitchToSignup = () => {
    navigate('/signup');
  };

  // handle form submission
  const handleLogin = async (event) => {
    event.preventDefault();

    // Reset errors before validation
    setEmailError('');
    setPasswordError('');

    // Simple email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Simple password validation
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      await api.login(email, password);
      navigate('/dashboard'); // Redirect to the dashboard after successful login
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-white"></div>

      {/* Login Form Card */}
      <div className="relative bg-white p-8 rounded-3xl shadow-xl w-full max-w-md mx-auto z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6">Access Account</h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6">Log in to access your Vault</p>

        {/* Error message for form submission */}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
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
            <div className="text-right mt-1">
              <a href="#" className="text-sm sm:text-base text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition transform duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* Switch to Signup Link */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-600">
          Need to create an account?{' '}
          <a href="#" onClick={handleSwitchToSignup} className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
