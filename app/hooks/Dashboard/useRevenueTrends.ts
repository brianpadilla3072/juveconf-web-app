import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

interface RevenueTrend {
  month: Date;
  totalAmount: number;
  paymentCount: number;
  avgAmount: number;
  monthName: string;
}

interface RevenueTrendsSummary {
  totalMonths: number;
  totalRevenue: number;
  totalPayments: number;
  avgMonthlyRevenue: number;
}

interface RevenueTrendsData {
  trends: RevenueTrend[];
  summary: RevenueTrendsSummary;
}

export const useRevenueTrends = (months: number = 12, eventId?: string) => {
  const [data, setData] = useState<RevenueTrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueTrends = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = { months: months.toString() };
      if (eventId) params.eventId = eventId;

      const response = await api.get('/dashboard/revenue-trends', { params });

      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las tendencias de ingresos');
      console.error('Error fetching revenue trends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueTrends();
  }, [months, eventId]);

  return {
    data,
    loading,
    error,
    refetch: fetchRevenueTrends
  };
};