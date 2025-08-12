import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

interface EventRanking {
  eventName: string;
  capacity: number;
  salesStartDate: Date;
  orderCount: number;
  totalRevenue: number;
  totalInvitees: number;
  attendedDay1: number;
  attendedDay2: number;
  utilizationRate: number;
}

interface EventsRankingSummary {
  totalEvents: number;
  totalRevenue: number;
  totalOrders: number;
  avgUtilization: number;
  topEvent: EventRanking | null;
}

interface EventsRankingData {
  ranking: EventRanking[];
  summary: EventsRankingSummary;
}

export const useEventsRanking = (year?: number, limit: number = 5) => {
  const [data, setData] = useState<EventsRankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventsRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = { limit: limit.toString() };
      if (year) params.year = year.toString();
      
      const response = await api.get('/dashboard/events-ranking', { params });
      
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el ranking de eventos');
      console.error('Error fetching events ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsRanking();
  }, [year, limit]);

  return {
    data,
    loading,
    error,
    refetch: fetchEventsRanking
  };
};