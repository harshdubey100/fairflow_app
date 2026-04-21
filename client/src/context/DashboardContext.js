import React, { createContext, useContext, useState, useCallback } from 'react';
import { getEmployeeDashboard, getAdminDashboard } from '../services/dashboardService';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployeeDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployeeDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error, fetchEmployeeDashboard, fetchAdminDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
