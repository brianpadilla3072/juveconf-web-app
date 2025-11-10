'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth.service';
import api from '@/lib/axios.config';

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
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (userData: Partial<Omit<User, 'id' | 'email' | 'role' | 'provider' | 'emailVerified'>>) => Promise<User>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      console.log('🔵 [checkAuth] Iniciando verificación...');
      const token = AuthService.getToken();

      if (!token) {
        console.log('🟡 [checkAuth] No hay token, usuario no autenticado');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('🔵 [checkAuth] Token encontrado, consultando perfil...');
      const response = await api.get('/auth/profile');
      console.log('🔵 [checkAuth] Perfil recibido:', response.data);

      setUser(response.data);
      console.log('✅ [checkAuth] Usuario autenticado correctamente');
    } catch (error) {
      console.error('🔴 [checkAuth] Error al verificar autenticación:', error);
      setUser(null);
      AuthService.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔵 [AuthContext] Iniciando login...');
      setIsLoading(true);

      console.log('🔵 [AuthContext] Enviando petición POST /auth/login');
      const response = await api.post('/auth/login', { email, password });
      console.log('🔵 [AuthContext] Respuesta recibida:', response.data);

      const { access_token, requirePasswordChange } = response.data;

      if (!access_token) {
        console.error('🔴 [AuthContext] No se recibió access_token');
        throw new Error('No se recibió un token de autenticación');
      }

      console.log('🔵 [AuthContext] Token recibido, guardando...');
      AuthService.setToken(access_token);

      console.log('🔵 [AuthContext] Verificando autenticación...');
      await checkAuth();

      // Verificar si el usuario debe cambiar su contraseña
      if (requirePasswordChange) {
        console.log('🔵 [AuthContext] Usuario debe cambiar contraseña temporal, redirigiendo a /change-password');
        router.push('/change-password');
      } else {
        console.log('🔵 [AuthContext] Login completado, redirigiendo a /app');
        router.push('/app');
      }
    } catch (error: any) {
      console.error('🔴 [AuthContext] Error en login:', error);
      console.error('🔴 [AuthContext] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // Limpiar cualquier token que pueda haberse guardado en caso de error
      AuthService.removeToken();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.removeToken();
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (userData: Partial<Omit<User, 'id' | 'email' | 'role' | 'provider' | 'emailVerified'>>): Promise<User> => {
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
