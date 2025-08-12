import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

interface OrdersByStatus {
  status: string;
  _count: { id: number };
  _sum: { total: number | null };
}

interface OrdersByPaymentType {
  paymentType: string;
  _count: { id: number };
  _sum: { total: number | null };
}

interface DailyOrderTrend {
  day: Date;
  orderCount: number;
  totalAmount: number;
  dayName: string;
}

interface OrdersAnalyticsSummary {
  totalOrders: number;
  totalValue: number;
  avgOrderValue: number;
}

interface OrdersAnalyticsData {
  byStatus: OrdersByStatus[];
  byPaymentType: OrdersByPaymentType[];
  dailyTrend: DailyOrderTrend[];
  summary: OrdersAnalyticsSummary;
}

export const useOrdersAnalytics = (year?: number) => {
  const [data, setData] = useState<OrdersAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = year ? { year: year.toString() } : {};
      const response = await api.get('/dashboard/orders-analytics', { params });
      
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las analíticas de órdenes');
      console.error('Error fetching orders analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAnalytics();
  }, [year]);

  return {
    data,
    loading,
    error,
    refetch: fetchOrdersAnalytics
  };
};