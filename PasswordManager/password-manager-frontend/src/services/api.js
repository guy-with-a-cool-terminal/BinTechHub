import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired tokens and attempt refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.replace('/login');
        return Promise.reject(error);
      }

      try {
        const response = await api.post('/token/refresh/', { refresh: refreshToken });
        const access = response.data.access;
        localStorage.setItem('access_token', access);

        error.config.headers['Authorization'] = `Bearer ${access}`;
        return api(error.config);
      } catch (refreshError) {
        handleApiError(refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.replace('/login');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Sign-up (Registration)
const signUp = async (email, password) => {
  try {
    if (email && password) {
      const response = await api.post('/signup/', { email, password });
      return response.data;
    } else {
      alert("Email and password are required.");
    }
  } catch (error) {
    handleApiError(error);
    throw new Error('Sign-up failed');
  }
};


// Login
const login = async (email, password) => {
  try {
    const response = await api.post('/login/', { email, password });
    const { access_token, refresh_token } = response.data;

    // Store tokens in localStorage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('Login failed');
  }
};
// Password management

// create password entry
const createPassword = async(passwordData) =>{
  try {
    const response = await api.post('/passwords/create/',passwordData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('create password failed :(')
  }
}
// Get password List
const getPasswords = async () => {
  try {
    const response = await api.get(`/passwords/?page=${page}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('Get Password List failed');
  }
};
// Get Single Password Entry
const getPassword = async (pk) => {
  try {
    const response = await api.get(`/passwords/${pk}/`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('Get Password failed');
  }
};
// Update Password Entry
const updatePassword = async (pk, passwordData) => {
  try {
    const response = await api.put(`/passwords/${pk}/update/`, passwordData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('Update Password failed');
  }
};
// Delete Password Entry
const deletePassword = async (pk) => {
  try {
    const response = await api.delete(`/passwords/${pk}/delete/`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('Delete Password failed');
  }
};

// General API error handler
const handleApiError = (error) => {
  if (error.response) {
    console.error('API error:', error.response.data);

    if (error.response.status === 401) {
      alert('Authentication failed. Please login again.');
    } else if (error.response.status === 403) {
      alert('Forbidden: You don’t have permission to perform this action.');
    } else if (error.response.status === 404) {
      alert('Resource not found.');
    } else if (error.response.status === 409) {
      alert('User with this email already exists.');
    } else if (error.response.status === 500) {
      alert('Internal server error.');
    } else {
      alert(`API error: ${error.response.data.message || 'Something went wrong.'}`);
    }
  } else if (error.request) {
    console.error('No response received:', error.request);
    alert('No response from server. Check your connection.');
  } else {
    console.error('Request error:', error.message);
    alert(`Request error: ${error.message}`);
  }
};

export default {
  login,
  signUp,
  createPassword,
  getPasswords,
  getPassword,
  updatePassword,
  deletePassword,
};
