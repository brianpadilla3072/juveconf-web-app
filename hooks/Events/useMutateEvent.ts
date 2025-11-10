"use client";
import api from '@/lib/axios.config';
import { toast } from 'sonner';
import { useState } from "react";

interface CreateEventData {
  year: number;
  topic: string;
  capacity: number;
  salesStartDate: string;
  salesEndDate?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
}

interface UpdateEventData {
  year?: number;
  topic?: string;
  capacity?: number;
  salesStartDate?: string;
  salesEndDate?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
}

export function useCreateEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEvent = async (data: CreateEventData): Promise<any | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/events', data);
      toast.success("Evento creado correctamente");
      return response.data;
    } catch (err: any) {
      setError(err);
      toast.error(err.response?.data?.message || "Error al crear evento");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createEvent, isLoading, error };
}

export function useUpdateEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateEvent = async (id: string, data: UpdateEventData): Promise<any | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.patch(`/events/${id}`, data);
      toast.success("Evento actualizado correctamente");
      return response.data;
    } catch (err: any) {
      setError(err);
      toast.error(err.response?.data?.message || "Error al actualizar evento");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateEvent, isLoading, error };
}

export function useDeleteEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.delete(`/events/${id}`);
      toast.success("Evento eliminado correctamente");
      return true;
    } catch (err: any) {
      setError(err);
      toast.error(err.response?.data?.message || "Error al eliminar evento");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteEvent, isLoading, error };
}