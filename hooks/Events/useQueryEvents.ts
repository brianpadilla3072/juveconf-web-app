"use client";
import api from '@/lib/axios.config';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  year: number;
  topic: string;
  capacity: number;
  salesStartDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export function useQueryEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/events');
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error al cargar eventos:", err);
      // Fallback data for development
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const refetch = () => {
    fetchEvents();
  };

  return { events, isLoading, error, refetch };
}

export function useQueryCurrentEvent() {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchCurrentEvent = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/events/current');
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error al cargar evento actual:", err);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentEvent();
  }, []);

  const refetch = () => {
    fetchCurrentEvent();
  };

  return { event, isLoading, error, refetch };
}
