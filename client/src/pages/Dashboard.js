import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

// Role-based redirect hub — waits for both Clerk and DB user to load
const Dashboard = () => {
  const { dbUser, loading, isSignedIn } = useAuthContext();

  // Still loading Clerk or DB user
  if (loading) return <Loader />;

  // Clerk finished loading and user is not signed in
  if (!isSignedIn) return <Navigate to="/login" replace />;

  // Clerk signed in but DB user not fetched yet (edge case)
  if (!dbUser) return <Loader />;

  if (dbUser.role === 'ADMIN' || dbUser.role === 'HR') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/employee/dashboard" replace />;
};

export default Dashboard;
