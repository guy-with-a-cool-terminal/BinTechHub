import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
// const API_BASE_URL = "https://bintechhubapi.onrender.com/api"

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

// clear tokens and redirect(helper function)
const clearTokensAndRedirect = () =>{
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.replace('/login')
}

// Handle expired tokens and attempt refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        clearTokensAndRedirect();
        return Promise.reject(error);
      }

      try {
        const response = await api.post('/token/refresh/', { refresh: refreshToken });
        const access = response.data.access;
        localStorage.setItem('access_token', access);

        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        handleApiError(refreshError);
        clearTokensAndRedirect();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Sign-up 
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

// logout
const logout = () =>{
  clearTokensAndRedirect()
};

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
const getPasswords = async (page=1) => {
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

// GITHUB SCAN ENDPOINTS

// trigger github oauth
const startGitHubOAuth = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    alert("You're not logged in");
    return;
  }
  window.location.href = `http://127.0.0.1:8000/api/github/?token=${token}`;
};


// get list of user repositories
const fetchUserRepositories = async () => {
  try {
    const response = await api.get('/github/repos/');
    return response.data; // expected: [{name, description, image, lastScanned}, ...]
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch repositories");
  }
};

// add repo to scan list
const addRepositoryToScan = async (repoName) => {
  try {
    const response = await api.post('/scan/repos/', { name: repoName });
    return response.data; // added repo details
  } catch (error) {
    handleApiError(error);
    throw new Error('Failed to add repository for scanning');
  }
};

// Trigger scan for a specific repo
const triggerRepositoryScan = async (repoName) => {
  try {
    const response = await api.post(`/scan/repos/${encodeURIComponent(repoName)}/start/`);
    return response.data; // scan status or results
  } catch (error) {
    handleApiError(error);
    throw new Error('Failed to start repository scan');
  }
};

// Get scan results for a repo
const getScanResults = async (repoName) => {
  try {
    const response = await api.get(`/scan/repos/${encodeURIComponent(repoName)}/results/`);
    return response.data; // scan results details
  } catch (error) {
    handleApiError(error);
    throw new Error('Failed to fetch scan results');
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
  logout,
  createPassword,
  getPasswords,
  getPassword,
  updatePassword,
  deletePassword,
  startGitHubOAuth, 
  fetchUserRepositories,
  addRepositoryToScan,
  triggerRepositoryScan,
  getScanResults,
};
