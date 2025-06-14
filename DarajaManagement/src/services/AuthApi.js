import http from "./http";
import { getAuth } from "firebase/auth";

// --- AUTH API ---

// Sign-up - email and Firebase token
const signUp = async (email, firebase_token) => {
  try {
    const response = await http.post('/onboarding/userauth/', { email, firebase_token });
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
    const response = await http.post('/onboarding/userauth/', payload);
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

// refresh firebase token
const getFreshToken = async () =>{
  try{
  const user = getAuth().currentUser;
  if(user){
    const token = await user.getIdToken(true);
    localStorage.setItem('firebase_token',token);
    return token
  }
  return null;
}catch (error){
  handleApiError(error)
  throw new Error('Failed to refresh Token')
}
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
  getFreshToken,
};
