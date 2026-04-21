import api from './api';

export const syncUser = (data) => api.post('/api/users/sync', data);
export const getMe = () => api.get('/api/users/me');
export const getAllUsers = () => api.get('/api/users');
