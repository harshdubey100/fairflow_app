import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

/**
 * ProtectedRoute
 * - If not signed in → redirect to /login
 * - If role doesn't match → redirect to their own dashboard
 * - Admin can access all routes
 */
const ProtectedRoute = ({ children, role }) => {
  const { dbUser, loading, isSignedIn } = useAuthContext();

  if (loading) return <Loader />;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (!dbUser) return <Loader />;

  // Admin can access everything
  if (dbUser.role === 'ADMIN') return children;

  // Role mismatch — redirect to correct dashboard
  if (role && dbUser.role !== role) {
    return <Navigate to={`/${dbUser.role.toLowerCase()}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
