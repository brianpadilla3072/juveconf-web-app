import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';

interface AttendanceByEvent {
  eventName: string;
  totalInvitees: number;
  attendanceByDay: { [dayNumber: string]: number };
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
  totalAttendanceByDay: { [dayNumber: string]: number };
  avgUtilization: number;
}

interface AttendanceAnalyticsData {
  byEvent: AttendanceByEvent[];
  registrationTrend: RegistrationTrend[];
  summary: AttendanceAnalyticsSummary;
}

export const useAttendanceAnalytics = (year?: number, eventId?: string) => {
  const [data, setData] = useState<AttendanceAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};
      if (year) params.year = year.toString();
      if (eventId) params.eventId = eventId;

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
  }, [year, eventId]);

  return {
    data,
    loading,
    error,
    refetch: fetchAttendanceAnalytics
  };
};