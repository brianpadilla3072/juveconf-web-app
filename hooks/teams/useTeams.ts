"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import api from '@/lib/axios.config';
import type { Team, TeamType } from '@/entities/Team';

/** Tipos de equipo del evento (GET /teams/admin/types) */
export function useTeamTypes(eventId: string | undefined) {
  const [types, setTypes] = useState<TeamType[]>([]);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!eventId) {
      setTypes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<TeamType[]>('/teams/admin/types', { params: { eventId } });
      setTypes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar los tipos de equipo');
      setTypes([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { types, loading, error, refetch };
}

/** Equipos inscriptos (GET /teams/admin/teams). `q` y `teamTypeId` se filtran en el servidor. */
export function useTeams(eventId: string | undefined, teamTypeId: string, q: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const refetch = useCallback(async () => {
    if (!eventId) {
      setTeams([]);
      setLoading(false);
      return;
    }
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = { eventId };
      if (teamTypeId) params.teamTypeId = teamTypeId;
      if (q.trim()) params.q = q.trim();
      const { data } = await api.get<Team[]>('/teams/admin/teams', { params });
      if (requestId !== requestIdRef.current) return;
      setTeams(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      setError(err.response?.data?.message || err.message || 'Error al cargar los equipos');
      setTeams([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [eventId, teamTypeId, q]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { teams, loading, error, refetch };
}

export const teamsApi = {
  createType: (body: Record<string, unknown>) => api.post<TeamType>('/teams/admin/types', body),
  updateType: (id: string, body: Record<string, unknown>) => api.patch<TeamType>(`/teams/admin/types/${id}`, body),
  deleteType: (id: string) => api.delete(`/teams/admin/types/${id}`),
  updateTeam: (id: string, body: Record<string, unknown>) => api.patch<Team>(`/teams/admin/teams/${id}`, body),
  deleteTeam: (id: string) => api.delete(`/teams/admin/teams/${id}`),
};

/** Mensaje legible de un error de axios (la API manda `message` como string o array) */
export function teamsErrorMessage(err: any, fallback: string): string {
  const msg = err?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join('. ');
  return typeof msg === 'string' && msg ? msg : fallback;
}
