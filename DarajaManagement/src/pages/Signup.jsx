import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../services/AuthApi';
import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../services/FirebaseAuth/firebase';
import { FcGoogle } from 'react-icons/fc';
import signupImage from '../assets/signup.png';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  const validateForm = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      valid = false;
    }

    return valid;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('firebase_token', idToken);
      await AuthApi.signUp(email, idToken);
      navigate('/dashboard');
    } catch (err) {
      console.error('signup failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email already exists');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      const user = result.user;
      const idToken = await user.getIdToken();
      localStorage.setItem('firebase_token', idToken);
      await AuthApi.signUp(user.email, idToken);
      navigate('/login');
    } catch (err) {
      console.error('Google sign-up failed:', err);
      setError('Google sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#0d1117]">
      {/* Left side with full background image */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${signupImage})` }}
        aria-label="Signup visual"
      />

      {/* Right side with matching background color */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-[#0d1117] px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-white mb-2">Create Your Account</h2>
          <p className="text-sm text-gray-400 mb-6">
            Enter your details below to get started
          </p>

          {error && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-800 rounded text-red-300 text-center font-semibold"
            >
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSignUp} noValidate>
            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email address"
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#161b22] border ${
                  emailError ? 'border-red-500' : 'border-gray-600'
                } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                required
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <p
                  id="email-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-3 rounded-lg bg-[#161b22] border ${
                  passwordError ? 'border-red-500' : 'border-gray-600'
                } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                required
                aria-invalid={passwordError ? 'true' : 'false'}
                aria-describedby={passwordError ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {passwordError && (
                <p
                  id="password-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full pl-10 pr-10 py-3 rounded-lg bg-[#161b22] border ${
                  confirmPasswordError ? 'border-red-500' : 'border-gray-600'
                } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                required
                aria-invalid={confirmPasswordError ? 'true' : 'false'}
                aria-describedby={confirmPasswordError ? 'confirmPassword-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {confirmPasswordError && (
                <p
                  id="confirmPassword-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition duration-200 focus:ring-4 focus:ring-blue-400 focus:outline-none ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>

            {/* Terms of Service */}
            <p className="text-xs text-gray-400 mt-3 text-center max-w-xs mx-auto">
              By clicking <span className="font-semibold">Sign Up</span>, you agree to our{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>

          {/* OR separator */}
          <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-700 after:flex-1 after:border-t after:border-gray-700">
            <p className="mx-4 text-gray-400 font-semibold">OR</p>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className={`w-full flex items-center justify-center gap-3 border border-gray-600 hover:bg-gray-700 text-white py-3 rounded-full font-semibold transition duration-200 mb-6 focus:ring-4 focus:ring-gray-600 focus:outline-none ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            <FcGoogle className="h-6 w-6" />
            {isLoading ? 'Signing Up...' : 'Sign Up with Google'}
          </button>

          {/* Switch to login */}
          <p className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <button
              onClick={handleSwitchToLogin}
              className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
