import axios from 'axios';

const api = axios.create({
  baseURL: process.env.SERVER_API || 'http://localhost:3072',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // opcional: 10 segundos de timeout
});

// Interceptores para errores o auth token
api.interceptors.request.use(
  (config) => {
    // Ejemplo: si quiere agregar un token de forma dinámica
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global de errores (ej: redirigir al login)
    if (error.response?.status === 401) {
      console.warn("No autorizado. Redirigiendo...");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
