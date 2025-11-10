"use client";
import api from '@/lib/axios.config';
import { useEffect, useState } from "react";
import { Invitee } from '@/entities/Invitee';

interface FilterInviteesParams {
  year?: number;
  eventId?: string;
  comboId?: string;
}

export function useQueryInvitees(params?: FilterInviteesParams) {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvitees = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/invitees", { params });
      setInvitees(res.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error al cargar invitados:", err);
      // Fallback data for development
      setInvitees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitees();
  }, [params?.year, params?.eventId, params?.comboId]);

  const refetch = () => {
    fetchInvitees();
  };

  return { invitees, isLoading, error, refetch };
}