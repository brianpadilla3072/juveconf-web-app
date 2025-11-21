'use client';

import { useState } from 'react';
import api from '@/lib/axios.config';
import { toast } from 'sonner';
import { Attendance } from '@/entities/Invitee';

export interface InviteeData {
  id: string;
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  attendance?: Attendance;
  payment?: {
    id: string;
    amount: number;
    payerEmail?: string;
    Order?: {
      Event?: {
        id: string;
        name: string;
        eventDays: any;
        eventStartDate: string;
      };
    };
  };
}

export interface AttendanceConfirmData {
  inviteeId: string;
  dayNumber: number;
  attended: boolean;
  notes?: string;
}

export interface AttendanceBatchConfirmData {
  inviteeId: string;
  days: Array<{ dayNumber: number; attended: boolean }>;
  notes?: string;
}

export function useAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteeData, setInviteeData] = useState<InviteeData | null>(null);

  const fetchInvitee = async (inviteeId: string): Promise<InviteeData | null> => {
    try {
      setIsLoading(true);
      const response = await api.get(`/invitees/${inviteeId}`);

      const invitee: InviteeData = {
        id: response.data.id,
        name: response.data.name,
        cuil: response.data.cuil,
        email: response.data.email,
        phone: response.data.phone,
        attendance: response.data.attendance,
        payment: response.data.Payment,
      };

      setInviteeData(invitee);
      return invitee;
    } catch (err: any) {
      const errorMessage = err.response?.status === 404
        ? 'Invitado no encontrado'
        : err.response?.data?.message || 'Error al buscar invitado';

      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAttendance = async (data: AttendanceConfirmData): Promise<boolean> => {
    try {
      setIsLoading(true);

      await api.patch(`/invitees/${data.inviteeId}/attendance/day`, {
        dayNumber: data.dayNumber,
        attended: data.attended,
        notes: data.notes || undefined,
      });

      if (inviteeData) {
        setInviteeData(prev => {
          if (!prev) return null;

          const updatedAttendance = prev.attendance || { days: {} };
          return {
            ...prev,
            attendance: {
              ...updatedAttendance,
              days: {
                ...updatedAttendance.days,
                [data.dayNumber.toString()]: {
                  attended: data.attended,
                  timestamp: new Date().toISOString()
                }
              }
            },
          };
        });
      }

      toast.success(data.attended ? 'Asistencia confirmada' : 'Ausencia registrada');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al confirmar asistencia';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAttendanceMultipleDays = async (data: AttendanceBatchConfirmData): Promise<boolean> => {
    try {
      setIsLoading(true);

      await api.patch(`/invitees/${data.inviteeId}/attendance/days`, {
        days: data.days,
        notes: data.notes || undefined,
      });

      if (inviteeData) {
        setInviteeData(prev => {
          if (!prev) return null;

          const updatedAttendance = prev.attendance || { days: {} };
          const newDays = { ...updatedAttendance.days };

          // Actualizar todos los días en el estado local
          data.days.forEach(day => {
            newDays[day.dayNumber.toString()] = {
              attended: day.attended,
              timestamp: new Date().toISOString()
            };
          });

          return {
            ...prev,
            attendance: {
              ...updatedAttendance,
              days: newDays
            },
          };
        });
      }

      toast.success('Asistencias guardadas correctamente');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al guardar asistencias';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setInviteeData(null);
  };

  return {
    fetchInvitee,
    confirmAttendance,
    confirmAttendanceMultipleDays,
    clearData,
    inviteeData,
    isLoading,
  };
}
