import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // Check if user is logged in by looking for token
  const token = localStorage.getItem('token');

  // Get user data
  const userString = localStorage.getItem('user');
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    // If JSON parsing fails, clear storage and redirect
    localStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists but user info is missing or corrupted
  if (!user) {
    localStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role doesn't match, redirect accordingly
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
