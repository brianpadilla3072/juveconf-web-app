import api from '@/lib/axios.config';
import { useState } from 'react';



interface Attendee {
  name: string;
  cuil: string;
}

interface PaymentPayload {
  id: string;
  email: string;
  title: string;
  unit_price: number;
  quantity: number;
  minPersons: number;
  maxPersons?: number; 
  attendees: Attendee[];
  eventId?: string;
}

export const useMercadoPago = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPreference = async (payload: PaymentPayload) => {
    setLoading(true);
    setError(null);

    try {

      const response = await api.post('/mercadopago/preference', payload);


      if (!response.data?.initPoint) {
        throw new Error('No se recibió el initPoint de MercadoPago.');
      }

      return response.data.initPoint;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPreference, loading, error };
};
