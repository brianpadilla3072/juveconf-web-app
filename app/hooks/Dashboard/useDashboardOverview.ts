import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

interface KPIs {
  totalRevenue: number;
  totalPayments: number;
  revenueGrowth: number;
  pendingOrders: number;
  activeEvents: number;
  totalAttendees: number;
  attendanceDay1: number;
  attendanceDay2: number;
  capacityUtilization: number;
  totalUsers: number;
}

interface Summary {
  year: number;
  previousYear: number;
  totalCapacity: number;
  revenueComparison: {
    current: number;
    previous: number;
    growth: number;
  };
}

interface DashboardOverview {
  kpis: KPIs;
  summary: Summary;
}

export const useDashboardOverview = (year?: number) => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = year ? { year: year.toString() } : {};
      const response = await api.get('/dashboard/overview', { params });
      
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el resumen del dashboard');
      console.error('Error fetching dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [year]);

  return {
    data,
    loading,
    error,
    refetch: fetchOverview
  };
};