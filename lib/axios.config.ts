import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthService } from './auth.service';
import { useRouter } from 'next/navigation';

// Crear instancia de axios
const api = axios.create({
  baseURL: process.env.SERVER_API || 'https://api.consagradosajesus.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // No es necesario ya que usamos el token en el header
  timeout: 10000,
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      const token = AuthService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Asegurar que las cabeceras necesarias estén presentes
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, devolver la respuesta
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Si el error es 401 y no es una solicitud de refresco
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const response = await axios.post(
          `${process.env.NET_PUBAPI_URL || 'https://api.consagradosajesus.com'}/auth/refresh-token`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(originalRequest.headers || {})
            }
          }
        );
        
        const { access_token } = response.data;
        
        if (access_token) {
          // Guardar el nuevo token
          AuthService.setToken(access_token);
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si hay un error al refrescar el token, cerrar sesión
        AuthService.removeToken();
        
        // Redirigir al login solo si estamos en el cliente
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    // Para otros errores, rechazar la promesa
    return Promise.reject(error);
  }
);

export default api;
