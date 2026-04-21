import React from 'react';
import { SignIn, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { isSignedIn } = useUser();
  if (isSignedIn) return <Navigate to="/dashboard" replace />;

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">✨ FairFlow</h1>
        <p className="login-sub">Intelligent Ticket Management System</p>
        <SignIn routing="hash" />
      </div>
    </div>
  );
};

export default Login;
