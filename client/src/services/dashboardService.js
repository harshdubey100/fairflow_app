import api from './api';

export const getEmployeeDashboard = () => api.get('/api/dashboard/employee');
export const getAdminDashboard = () => api.get('/api/dashboard/admin');
export const getMyPerformance = () => api.get('/api/performance/me');
export const getAllPerformance = () => api.get('/api/performance');
