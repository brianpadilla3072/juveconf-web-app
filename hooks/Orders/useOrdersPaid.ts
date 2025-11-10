"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';
import { Order } from '@/entities/Order';

export const useOrdersPaid = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersPaid = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Order[]>('/orders/paid');

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar las órdenes pagadas';
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersPaid();
  }, []);

  const refetch = () => {
    fetchOrdersPaid();
  };

  return {
    orders,
    loading,
    error,
    refetch,
  };
};

export default useOrdersPaid;
