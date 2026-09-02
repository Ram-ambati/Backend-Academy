import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

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

// ── Silent Refresh Logic ──
// Track whether a refresh is already in-flight so we don't fire multiple
// refresh requests when several 401s arrive at the same time.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor — attempt silent refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh if the 401 came from auth endpoints themselves
    const isAuthEndpoint =
      originalRequest?.url?.includes('/api/v1/auth/login') ||
      originalRequest?.url?.includes('/api/v1/auth/register') ||
      originalRequest?.url?.includes('/api/v1/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        // No refresh token stored — force logout
        useAuthStore.getState().logout();
        window.location.href = '/auth/login?expired=true';
        return Promise.reject(error);
      }

      try {
        // Call the refresh endpoint directly (not through `api` to avoid interceptor loops)
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
        const response = await axios.post(`${baseURL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        // Persist the new token in the store
        useAuthStore.getState().setToken(newAccessToken);

        // Retry the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Process any queued requests that were waiting for the refresh
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired/revoked — force full logout
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/auth/login?expired=true';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
