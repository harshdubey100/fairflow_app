import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { syncUser, getMe } from '../services/userService';
import { setTokenGetter } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wire Clerk's getToken into the Axios interceptor as soon as auth loads
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setDbUser(null);
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        await syncUser({
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.firstName || 'User',
        });
        const res = await getMe();
        setDbUser(res.data);
      } catch (err) {
        console.error('Auth init error:', err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isLoaded, isSignedIn, user]);

  return (
    <AuthContext.Provider value={{ dbUser, loading, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
