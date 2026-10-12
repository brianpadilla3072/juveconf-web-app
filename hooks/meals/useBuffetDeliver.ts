"use client";
import { useState } from 'react';
import api from '@/lib/axios.config';
import { toast } from 'sonner';
import { extractApiError } from '@/lib/meals';
import type { MealDeliverResult } from '@/entities/Meal';

/** Marca una comida como entregada (POST /meals/deliver) */
export function useBuffetDeliver() {
  const [isDelivering, setIsDelivering] = useState(false);

  const deliver = async (
    inviteeId: string,
    slotCode: string,
  ): Promise<MealDeliverResult | null> => {
    try {
      setIsDelivering(true);
      const { data } = await api.post<MealDeliverResult>('/meals/deliver', {
        inviteeId,
        slotCode,
      });
      return data;
    } catch (err: any) {
      toast.error(extractApiError(err, 'No se pudo registrar la entrega').message);
      return null;
    } finally {
      setIsDelivering(false);
    }
  };

  return { deliver, isDelivering };
}

export default useBuffetDeliver;
