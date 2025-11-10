"use client";

import { useState } from 'react';
import api from '@/lib/axios.config';
import { toast } from 'sonner';

export interface AttendeeDto {
  name: string;
  cuil: string;
}

export interface CreateTransferOrderDto {
  id: string; // comboId
  email: string;
  phone: string;
  cuil: string;
  title: string; // combo name
  unit_price: number;
  quantity: number;
  minPersons: number;
  maxPersons?: number;
  attendees: AttendeeDto[];
  eventId: string;
  userId?: string;
}

export const useCreateOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (dto: CreateTransferOrderDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/transfers/create-transfer-order', dto);

      if (response.data.success) {
        toast.success('Orden creada exitosamente');
        return response.data;
      } else {
        throw new Error('Error al crear la orden');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.userMessage ||
                          err.response?.data?.message ||
                          err.message ||
                          'Error al crear la orden';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    isLoading,
    error
  };
};

export default useCreateOrder;
