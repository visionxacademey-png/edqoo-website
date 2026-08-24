import axios from 'axios';

// Get API URL from env, falling back to localhost mock for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to attach JWT auth tokens to every call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Edqoo_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally (e.g. token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // If unauthorized (401), we could trigger a logout hook or redirect
      if (error.response.status === 401) {
        console.warn('Unauthorized request - session expired.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
