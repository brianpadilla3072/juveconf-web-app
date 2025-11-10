import api from '@/lib/axios.config';
import { useState } from 'react';

interface Attendee {
  name: string;
  cuil: string;
}

interface TransferOrderPayload {
  id: string;
  email: string;
  quantity: number;
  minPersons: number;
  maxPersons?: number;
  attendees: Attendee[];
  eventId: string;
  userId?: string;
  cuil: string;
}

export const useTransferOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createTransferOrder = async (payload: TransferOrderPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post('/transfers/create-transfer-order', payload);

      if (response.data?.success !== true) {
        throw new Error('No se confirmó la creación de la orden de transferencia.');
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createTransferOrder, loading, error, success };
};
