// src/hooks/useEvents.ts
import api from '@/config/axiosInstance';
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events/current');
        setEvents(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading, error };
}
