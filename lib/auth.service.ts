import Cookies from 'js-cookie';
import api from './axios.config';

type User = {
  id: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  dni: string;
  role: string;
  provider: string;
  emailVerified: boolean;
};

// Usamos localStorage para almacenar el token JWT
const TOKEN_KEY = 'auth_token';

// Opciones para las cookies (si se usan en el futuro)
const COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const AuthService = {
  // Guardar token en localStorage
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Obtener token de localStorage
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Eliminar token (logout)
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      // Limpiar cualquier otro dato relacionado con la sesión
      localStorage.removeItem('user');
      sessionStorage.clear();
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Obtener headers de autorización
  getAuthHeaders(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Obtener datos del usuario desde el token (si es necesario)
  getUserFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      // Decodificar el token JWT (sin verificación)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  },

  // Verificar si el token está próximo a expirar
  isTokenExpiringSoon(thresholdMinutes = 5): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      const now = Date.now();
      return (exp - now) < (thresholdMinutes * 60 * 1000);
    } catch (error) {
      return false;
    }
  },

  // Actualizar perfil del usuario
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.patch('/auth/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  },
};
