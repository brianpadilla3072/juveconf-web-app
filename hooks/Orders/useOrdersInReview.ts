"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';
import { Order } from '@/entities/Order';

export const useOrdersInReview = (year?: number, eventId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersInReview = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { ...(eventId ? { eventId } : year ? { year } : {}) };
      const response = await api.get<Order[]>('/orders/review', { params });
      
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar las órdenes';
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersInReview();
  }, [year, eventId]);

  const refetch = () => {
    fetchOrdersInReview();
  };

  return { 
    orders, 
    loading, 
    error, 
    refetch,
  };
};

export default useOrdersInReview;
