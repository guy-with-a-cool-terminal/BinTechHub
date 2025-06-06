import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('firebase_token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
