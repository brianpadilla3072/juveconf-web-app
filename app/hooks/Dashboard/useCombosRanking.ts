import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

interface ComboRanking {
  comboName: string;
  price: number;
  minPersons: number;
  orderCount: number;
  totalRevenue: number;
  totalInvitees: number;
  avgOrderValue: number;
}

interface CombosRankingSummary {
  totalCombos: number;
  totalRevenue: number;
  totalOrders: number;
  mostPopular: ComboRanking | null;
}

interface CombosRankingData {
  ranking: ComboRanking[];
  summary: CombosRankingSummary;
}

export const useCombosRanking = (year?: number, limit: number = 10, eventId?: string) => {
  const [data, setData] = useState<CombosRankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCombosRanking = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = { limit: limit.toString() };
      if (year) params.year = year.toString();
      if (eventId) params.eventId = eventId;

      const response = await api.get('/dashboard/combos-ranking', { params });

      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el ranking de combos');
      console.error('Error fetching combos ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombosRanking();
  }, [year, limit, eventId]);

  return {
    data,
    loading,
    error,
    refetch: fetchCombosRanking
  };
};