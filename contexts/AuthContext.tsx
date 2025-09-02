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
      const token = AuthService.getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
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
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      if (!access_token) {
        throw new Error('No se recibió un token de autenticación');
      }
      
      AuthService.setToken(access_token);
      await checkAuth(); // Verificar la autenticación después del login
      
      // Solo redirigir si todo salió bien (no hay errores hasta aquí)
      router.push('/app');
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error);
      // Limpiar cualquier token que pueda haberse guardado en caso de error
      AuthService.removeToken();
      setUser(null);
      throw error;
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
