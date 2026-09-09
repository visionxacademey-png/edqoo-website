import axios from 'axios';

// Get API URL from env, falling back to /api (handled by Vite dev proxy or production reverse proxy)
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor to attach JWT auth tokens to every call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Edqoo_token') || localStorage.getItem('edqoo_token');
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
      if (error.response.status === 401) {
        console.warn('Unauthorized request to endpoint:', error.config?.url);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

