import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../services/AuthApi';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSwitchToSignup = () => {
    navigate('/signup');
  };

  const validateForm = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setError('');

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const firebaseAuth = getAuth();
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('firebase_token', idToken);
      await AuthApi.login(idToken, email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const firebaseAuth = getAuth();
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      localStorage.setItem('firebase_token', idToken);
      await AuthApi.login(idToken, user.email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login failed:', err);
      setError('Google login failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0d1117] px-4">
      <div className="w-full max-w-md bg-[#161b22] rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-semibold text-white mb-3 text-center">
          SECURE VAULT
        </h2>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Enter your credentials to access your Vault
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-800 rounded text-red-300 text-center font-semibold"
          >
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email address"
              className={`w-full pl-11 pr-4 py-3 rounded-lg bg-[#0d1117] border ${
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

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition duration-200 focus:ring-4 focus:ring-blue-400 focus:outline-none ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
            style={{ height: '48px' }}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* OR separator */}
        <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-700 after:flex-1 after:border-t after:border-gray-700">
          <p className="mx-4 text-gray-400 font-semibold">OR</p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className={`w-full flex items-center justify-center gap-3 border border-gray-600 hover:bg-gray-700 text-white py-3 rounded-full font-semibold transition duration-200 mb-6 focus:ring-4 focus:ring-gray-600 focus:outline-none ${
            isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ height: '48px' }}
        >
          <FcGoogle className="h-6 w-6" />
          {isGoogleLoading ? 'Logging In...' : 'Log In with Google'}
        </button>

        {/* Switch to signup */}
        <p className="mt-6 text-sm text-gray-400 text-center">
          Need to create an account?{' '}
          <button
            onClick={handleSwitchToSignup}
            className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
