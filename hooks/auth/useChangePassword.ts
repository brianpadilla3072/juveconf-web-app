import { useState } from 'react';
import api from '@/lib/axios.config';
import { toast } from '@/hooks/use-toast';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UseChangePasswordReturn {
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useChangePassword(): UseChangePasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validaciones del frontend
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (data.newPassword.length < 8) {
        throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
      }

      if (data.currentPassword === data.newPassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }

      const response = await api.patch('/auth/profile/password', data);

      if (response.status === 200) {
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido cambiada exitosamente.",
          variant: "default",
        });
        return true;
      }

      return false;
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Error al cambiar la contraseña';
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
  };
}