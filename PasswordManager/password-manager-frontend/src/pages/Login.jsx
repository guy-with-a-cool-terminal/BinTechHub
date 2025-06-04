import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/20/solid'; // Import icons
import { useNavigate } from 'react-router-dom'; // import navigate
import api from '../services/api';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/FirebaseAuth/firebase';

export default function Login() {
  const navigate = useNavigate();

  // state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(''); // Email validation error
  const [passwordError, setPasswordError] = useState(''); // Password validation error
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Google loading state

  const handleSwitchToSignup = () => {
    navigate('/signup');
  };

  // Email/password login
  const handleLogin = async (event) => {
    event.preventDefault();

    setEmailError('');
    setPasswordError('');
    setError('');

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const firebaseAuth = getAuth();
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await userCredential.user.getIdToken();
      console.log("ID Token:", idToken);
      localStorage.setItem('firebase_token', idToken);
      await api.login(idToken, email);
      console.log('Before navigate');
      navigate('/dashboard');
      console.log('After navigate');

    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const firebaseAuth = getAuth();
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log("ID Token:", idToken);
      localStorage.setItem('firebase_token', idToken);
      await api.login(idToken, user.email);
      console.log('Before navigate');
      navigate('/dashboard');
      console.log('After navigate');

    } catch (err) {
      console.error('Google login failed:', err);
      setError('Google login failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="absolute top-0 left-0 w-full h-full bg-white"></div>

      <div className="relative bg-white p-8 rounded-3xl shadow-xl w-full max-w-md mx-auto z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6">Access Account</h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6">Log in to access your Vault</p>

        {error && <div className="mb-4 text-red-500">{error}</div>}

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

          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition transform duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-300 after:flex-1 after:border-t after:border-gray-300">
          <p className="mx-4 text-gray-500 font-semibold">OR</p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className={`w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-full py-3 font-semibold text-gray-700 hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M533.5 278.4c0-17.6-1.6-35.1-4.8-51.9H272.1v98.3h147.4c-6.3 34.3-25 63.4-53.7 82.9v68.8h86.7c50.7-46.7 79.9-115.5 79.9-198.1z"
              fill="#4285F4"
            />
            <path
              d="M272.1 544.3c72.6 0 133.6-24 178.2-65.3l-86.7-68.8c-24.1 16.1-55 25.6-91.5 25.6-70.4 0-130-47.5-151.4-111.2H34.7v69.9c44.3 87.1 134.6 150.6 237.4 150.6z"
              fill="#34A853"
            />
            <path
              d="M120.7 323.7c-10.5-31.2-10.5-64.8 0-96l-73-69.9C15 209.7 0 239.7 0 272.3s15 62.6 47.7 114.5l73-69.9z"
              fill="#FBBC05"
            />
            <path
              d="M272.1 107.6c38.6 0 73.4 13.3 100.7 39.4l75.4-75.4C398.1 24 337.2 0 272.1 0 169.3 0 79 63.5 34.7 150.6l73 69.9c21.4-63.7 81-111.2 164.4-111.2z"
              fill="#EA4335"
            />
          </svg>
          <span>{isGoogleLoading ? 'Logging In...' : 'Login with Google'}</span>
        </button>

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
