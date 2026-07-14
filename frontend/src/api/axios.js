import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

// Note: For this mock setup, we won't strictly rely on this axios instance for everything, 
// as we are building mock API functions that return Promises. 
// But we set it up to show the proper production architecture.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on unauthorized
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
