"use client";
import { useState } from 'react';
import api from '@/lib/axios.config';
import { extractApiError } from '@/lib/meals';
import type { BuffetView, MealScanPayload } from '@/entities/Meal';

export interface BuffetLookupResult {
  view: BuffetView | null;
  error: string | null;
}

/** Consulta la entrega de un turno a partir del QR o del código (POST /meals/scan) */
export function useBuffetScan() {
  const [isScanning, setIsScanning] = useState(false);

  const scan = async (payload: MealScanPayload): Promise<BuffetLookupResult> => {
    try {
      setIsScanning(true);
      const { data } = await api.post<BuffetView>('/meals/scan', payload);
      return { view: data, error: null };
    } catch (err: any) {
      const { message } = extractApiError(err, 'No se pudo consultar la entrada');
      return { view: null, error: message };
    } finally {
      setIsScanning(false);
    }
  };

  return { scan, isScanning };
}

export default useBuffetScan;
