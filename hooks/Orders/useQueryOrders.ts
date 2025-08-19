"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

type Invitee = {
  name: string;
  cuil: string;
};

type Combo = {
  id: string;
  name: string;
  price: number;
  year: number;
  minPersons: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  eventId: string;
};

type Event = {
  id: string;
  year: number;
  topic: string;
  capacity: number;
  salesStartDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type Payment = {
  [key: string]: any;
};

type Order = {
  id: string;
  year: number;
  userId: string | null;
  eventId: string;
  total: number;
  status: string;
  paymentType: string;
  externalReference: string | null;
  metadataToken: string;
  preferenceId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  email: string;
  cuil: string;
  user: any | null;
  event: Event;
  combos: Combo[];
  payments: Payment[];
  invitees: Invitee[];
};

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