"use client";
import api from '@/lib/axios.config';
import { useEffect, useState } from 'react';
import { Event } from '@/entities/Event';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchCurrentEvent = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/events/current');
      // El backend ahora retorna un array de eventos del año actual
      setEvents(Array.isArray(data) ? data : [data].filter(Boolean));
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error al cargar eventos actuales:", err);
      setEvents([]);
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

  // Para mantener compatibilidad, retornamos también el primer evento
  const currentEvent = events.length > 0 ? events[0] : null;

  return {
    events,           // Array de todos los eventos del año actual
    event: currentEvent,  // Primer evento (para compatibilidad)
    isLoading,
    error,
    refetch
  };
}
