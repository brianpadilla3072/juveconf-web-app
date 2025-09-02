"use client";
import { useState } from 'react';
import api from '@/lib/axios.config';
import { AuthService } from '@/lib/auth.service';

interface RejectOrderResponse {
  success: boolean;
  error?: string;
  message?: string;
  [key: string]: any; // Allow for additional properties
}

const useRejectOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const rejectOrder = async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Verificar si hay un token disponible
      const token = AuthService.getToken();
      console.log('Current token:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        const errorMsg = 'No se encontró el token de autenticación';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      console.log(`Attempting to reject order ${orderId}...`);
      const response = await api.delete<RejectOrderResponse>(
        `/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Reject order response:', response);
      
      // Para DELETE, un status 204 (No Content) indica éxito
      if (response.status === 204 || response.status === 200) {
        console.log(`Order ${orderId} rejected successfully`);
        setIsSuccess(true);
        return { success: true };
      } else {
        const errorMsg = response.data?.error || 'Error al rechazar la orden';
        console.error('Error in response:', errorMsg, 'Response data:', response.data);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error rejecting order:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
      
      let errorMessage = 'Error al rechazar la orden';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data?.message || 
                      `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rejectOrder,
    isLoading,
    error,
    isSuccess,
    reset: () => {
      setError(null);
      setIsSuccess(false);
    },
  };
};

export default useRejectOrder;