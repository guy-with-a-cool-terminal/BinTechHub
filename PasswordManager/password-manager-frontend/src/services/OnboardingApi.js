import axios from 'axios';

const isDev = window.location.hostname === 'localhost';
const API_BASE_URL = isDev 
  ? 'http://127.0.0.1:8000/api' 
  : 'https://bintechhubapi.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebase_token');
    // Skip Authorization header for userauth endpoint
    if (token && !config.url.endsWith('/userauth/')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('firebase_token');
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

// --- AUTH API ---

// Sign-up - email and Firebase token
const signUp = async (email, firebase_token) => {
  try {
    const response = await api.post('/onboarding/userauth/', { email, firebase_token });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('Sign-up failed');
  }
};

// Login - send firebase_token (email optional)
const login = async (firebase_token, email = null) => {
  try {
    const payload = { firebase_token };
    if (email) payload.email = email;
    const response = await api.post('/onboarding/userauth/', payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('Login failed');
  }
};

// Logout - clear token and redirect
const logout = () => {
  localStorage.removeItem('firebase_token');
  window.location.replace('/login');
};

// --- ERROR HANDLER ---

const handleApiError = (error) => {
  if (error.response) {
    console.error('API error:', error.response.data);
    switch (error.response.status) {
      case 401:
        alert('Authentication failed. Please login again.');
        break;
      case 403:
        alert('Forbidden: You don’t have permission.');
        break;
      case 404:
        alert('Resource not found.');
        break;
      case 409:
        alert('User with this email already exists.');
        break;
      case 500:
        alert('Internal server error.');
        break;
      default:
        alert(`API error: ${error.response.data.message || 'Something went wrong.'}`);
    }
  } else if (error.request) {
    console.error('No response:', error.request);
    alert('No response from server. Check your connection.');
  } else {
    console.error('Request error:', error.message);
    alert(`Request error: ${error.message}`);
  }
};

export default {
  signUp,
  login,
  logout,
};
