"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';
import { Order } from '@/entities/Order';

export const useQueryOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      // Intentar obtener órdenes en revisión primero, luego expandir si hay más endpoints
      const response = await api.get<Order[]>('/orders/review');
      
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
    fetchOrders();
  }, []);

  const refetch = () => {
    fetchOrders();
  };

  return { 
    orders, 
    loading, 
    error, 
    refetch,
  };
};

export default useQueryOrders;