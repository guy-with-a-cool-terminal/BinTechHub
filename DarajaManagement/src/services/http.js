import axios from 'axios';
import AuthApi from './AuthApi';

const isDev = window.location.hostname === 'localhost';
const API_BASE_URL = isDev 
  ? 'http://127.0.0.1:8000/api' 
  : 'https://bintechhubapi.onrender.com/api';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
http.interceptors.request.use(async (config) => {
  if (!config.url.endsWith('/userauth/')) {
    const token = await AuthApi.getFreshToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// --- Response Interceptor ---
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('firebase_token');
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default http;
