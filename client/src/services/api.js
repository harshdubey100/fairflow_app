import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/',
});

// Token getter is set by AuthContext after Clerk loads
let _getToken = null;
export const setTokenGetter = (fn) => { _getToken = fn; };

api.interceptors.request.use(async (config) => {
  try {
    if (_getToken) {
      const token = await _getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

export default api;
