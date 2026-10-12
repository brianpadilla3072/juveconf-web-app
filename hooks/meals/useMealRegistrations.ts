"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import api from '@/lib/axios.config';
import type { MealRegistration } from '@/entities/Meal';

/**
 * Registros de comidas de un evento (GET /meals/admin/registrations).
 * `q` se envía al servidor (nombre, apellido o código de inscripción).
 */
export function useMealRegistrations(eventId: string | undefined, q: string) {
  const [registrations, setRegistrations] = useState<MealRegistration[]>([]);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchRegistrations = useCallback(async () => {
    if (!eventId) {
      setRegistrations([]);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = { eventId };
      if (q.trim()) params.q = q.trim();

      const { data } = await api.get<MealRegistration[]>('/meals/admin/registrations', {
        params,
      });
      if (requestId !== requestIdRef.current) return; // llegó una respuesta más nueva

      if (!Array.isArray(data)) throw new Error('Formato de respuesta inesperado');
      setRegistrations(data);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      setError(err.response?.data?.message || err.message || 'Error al cargar los registros');
      setRegistrations([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [eventId, q]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return { registrations, loading, error, refetch: fetchRegistrations };
}

export default useMealRegistrations;
