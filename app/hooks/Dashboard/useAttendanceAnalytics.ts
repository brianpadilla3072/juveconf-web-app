import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

interface AttendanceByEvent {
  eventName: string;
  totalInvitees: number;
  attendedDay1: number;
  attendedDay2: number;
  capacity: number;
  utilizationRate: number;
}

interface RegistrationTrend {
  week: Date;
  registrations: number;
  weekName: string;
}

interface AttendanceAnalyticsSummary {
  totalRegistrations: number;
  totalAttendedDay1: number;
  totalAttendedDay2: number;
  avgUtilization: number;
}

interface AttendanceAnalyticsData {
  byEvent: AttendanceByEvent[];
  registrationTrend: RegistrationTrend[];
  summary: AttendanceAnalyticsSummary;
}

export const useAttendanceAnalytics = (year?: number) => {
  const [data, setData] = useState<AttendanceAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = year ? { year: year.toString() } : {};
      const response = await api.get('/dashboard/attendance-analytics', { params });
      
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las analíticas de asistencia');
      console.error('Error fetching attendance analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceAnalytics();
  }, [year]);

  return {
    data,
    loading,
    error,
    refetch: fetchAttendanceAnalytics
  };
};