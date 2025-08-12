import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

interface HeatmapData {
  hour: number;
  dayOfWeek: number;
  activityCount: number;
  dayName: string;
}

interface ActivityHeatmapSummary {
  totalActivity: number;
  peakHour: {
    hour: number;
    activityCount: number;
  };
  peakDay: {
    dayOfWeek: number;
    activityCount: number;
    dayName?: string;
  };
}

interface ActivityHeatmapData {
  heatmap: HeatmapData[];
  summary: ActivityHeatmapSummary;
}

export const useActivityHeatmap = (year?: number) => {
  const [data, setData] = useState<ActivityHeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityHeatmap = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = year ? { year: year.toString() } : {};
      const response = await api.get('/dashboard/activity-heatmap', { params });
      
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el mapa de calor de actividad');
      console.error('Error fetching activity heatmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityHeatmap();
  }, [year]);

  return {
    data,
    loading,
    error,
    refetch: fetchActivityHeatmap
  };
};