import axios from 'axios';

// Get backend URL from Vite environment variables
const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: `${baseURL}/api`, // Add /api since your backend routes are under /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;
