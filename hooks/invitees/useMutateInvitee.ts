"use client";
import api from '@/lib/axios.config';
import { toast } from 'sonner';
import { useState } from "react";

interface CreateInviteeData {
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  orderId: string;
  paymentId: string;
}

interface UpdateInviteeData {
  name?: string;
  cuil?: string;
  email?: string;
  phone?: string;
}

export function useCreateInvitee() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createInvitee = async (data: CreateInviteeData): Promise<any | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/invitees', data);
      toast.success("Invitado creado correctamente");
      return response.data;
    } catch (err: any) {
      setError(err);
      toast.error(err.response?.data?.message || "Error al crear invitado");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createInvitee, isLoading, error };
}

export function useUpdateInvitee() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateInvitee = async (id: string, data: UpdateInviteeData): Promise<any | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.patch(`/invitees/${id}`, data);
      toast.success("Invitado actualizado correctamente");
      return response.data;
    } catch (err: any) {
      setError(err);
      toast.error(err.response?.data?.message || "Error al actualizar invitado");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateInvitee, isLoading, error };
}

export function useDeleteInvitee() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteInvitee = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.delete(`/invitees/${id}`);
      toast.success("Invitado eliminado correctamente");
      return true;
    } catch (err: any) {
      setError(err);
      toast.error(err.response?.data?.message || "Error al eliminar invitado");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteInvitee, isLoading, error };
}