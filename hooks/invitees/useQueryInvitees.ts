"use client";
import api from '@/lib/axios.config';
import { useEffect, useState } from "react";

interface FilterInviteesParams {
  year?: number;
}

interface Invitee {
  id: string;
  name: string;
  cuil: string;
  orderId: string;
  paymentId: string;
  attendedDay1: boolean | null;
  attendedDay2: boolean | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  payment: {
    id: string;
    amount: number;
    type: string;
    payerEmail: string | null;
    payerName: string | null;
    payerDni: string | null;
  };
  order: {
    id: string;
    total: number;
    status: string;
    email: string | null;
    cuil: string | null;
  };
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
  }, [params?.year]);

  const refetch = () => {
    fetchInvitees();
  };

  return { invitees, isLoading, error, refetch };
}