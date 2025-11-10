import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthService } from './auth.service';
import { useRouter } from 'next/navigation';

// Crear instancia de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3072',
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
      console.log('🟡 [Axios Interceptor] Token from storage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🟡 [Axios Interceptor] Authorization header set:', config.headers.Authorization ? 'YES' : 'NO');
      }

      // Asegurar que las cabeceras necesarias estén presentes
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
    console.log('🟡 [Axios Interceptor] Request config:', { url: config.url, headers: config.headers });
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
    // Si el error es 401, verificar si NO es del endpoint de login
    if (error.response?.status === 401) {
      const isLoginEndpoint = error.config?.url?.includes('/auth/login');
      const isRegisterEndpoint = error.config?.url?.includes('/auth/register');

      // Si NO es login ni register, significa que el token es inválido
      if (!isLoginEndpoint && !isRegisterEndpoint) {
        console.log('[Axios Interceptor] 401 Unauthorized - Token inválido o expirado');

        // Borrar token y redirigir al login solo si estamos en el cliente
        if (typeof window !== 'undefined') {
          AuthService.removeToken();
          // Solo redirigir si no estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } else {
        // Si es login/register, es un error de credenciales, no tocar el token
        console.log('[Axios Interceptor] 401 en login/register - Credenciales incorrectas');
      }
    }

    // Para todos los errores, rechazar la promesa
    return Promise.reject(error);
  }
);

export default api;
