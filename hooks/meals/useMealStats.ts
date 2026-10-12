"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import api from '@/lib/axios.config';
import type { MealStats } from '@/entities/Meal';

interface UseMealStatsOptions {
  /** Si se indica, refresca los conteos cada `pollMs` milisegundos */
  pollMs?: number;
}

/** Conteos de comidas de un evento (GET /meals/admin/stats) */
export function useMealStats(eventId: string | undefined, options: UseMealStatsOptions = {}) {
  const { pollMs } = options;
  const [stats, setStats] = useState<MealStats | null>(null);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchStats = useCallback(
    async (silent = false) => {
      if (!eventId) {
        setStats(null);
        setLoading(false);
        return;
      }

      const requestId = ++requestIdRef.current;
      if (!silent) setLoading(true);

      try {
        const { data } = await api.get<MealStats>('/meals/admin/stats', {
          params: { eventId },
        });
        if (requestId !== requestIdRef.current) return;
        setStats(data);
        setError(null);
      } catch (err: any) {
        if (requestId !== requestIdRef.current) return;
        setError(err.response?.data?.message || err.message || 'Error al cargar los conteos');
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [eventId],
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!pollMs || !eventId) return;
    const timer = setInterval(() => fetchStats(true), pollMs);
    return () => clearInterval(timer);
  }, [pollMs, eventId, fetchStats]);

  return { stats, loading, error, refetch: () => fetchStats() };
}

export default useMealStats;
