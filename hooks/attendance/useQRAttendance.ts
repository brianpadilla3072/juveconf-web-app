'use client';

import { useState } from 'react';
import api from '@/lib/axios.config';
import { toast } from 'sonner';

interface QRData {
  inviteId: string;
  paymentId?: string; // Opcional - permite invitados sin pago
}

import { Attendance } from '@/entities/Invitee';

interface InviteeData {
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
  };
  order?: {
    status: string;
  };
}

interface AttendanceConfirmation {
  inviteeId: string;
  dayNumber: number;
  email?: string;
  phone?: string;
  notes?: string;
}

export function useQRAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [inviteeData, setInviteeData] = useState<InviteeData | null>(null);

  // Buscar invitado por QR data
  const fetchInviteeByQR = async (qrData: QRData): Promise<InviteeData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar por inviteId primero
      const response = await api.get(`/invitees/${qrData.inviteId}`);

      // Verificar que el paymentId coincida (solo si existe en el QR)
      if (qrData.paymentId && response.data.paymentId !== qrData.paymentId) {
        throw new Error('Los datos del QR no coinciden con el invitado');
      }

      const invitee: InviteeData = {
        id: response.data.id,
        name: response.data.name,
        cuil: response.data.cuil,
        email: response.data.email,
        phone: response.data.phone,
        attendance: response.data.attendance,
        payment: response.data.payment,
        order: response.data.order,
      };

      setInviteeData(invitee);
      return invitee;
      
    } catch (err: any) {
      const errorMessage = err.response?.status === 404 
        ? 'Invitado no encontrado'
        : err.response?.data?.message || 'Error al buscar invitado';
      
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmar asistencia y actualizar datos
  const confirmAttendance = async (data: AttendanceConfirmation): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Actualizar asistencia usando el nuevo endpoint dinámico
      const attendanceData = {
        dayNumber: data.dayNumber,
        attended: true,
        notes: data.notes || undefined,
      };

      await api.patch(`/invitees/${data.inviteeId}/attendance/day`, attendanceData);

      // Actualizar datos personales si se proporcionaron
      if (data.email || data.phone) {
        const updateData: { email?: string; phone?: string } = {};

        if (data.email) {
          updateData.email = data.email;
        }
        if (data.phone) {
          updateData.phone = data.phone;
        }

        await api.patch(`/invitees/${data.inviteeId}`, updateData);
      }

      // Actualizar datos locales
      if (inviteeData) {
        setInviteeData(prev => {
          if (!prev) return null;

          const updatedAttendance = prev.attendance || { days: {} };
          const newAttendance = {
            ...updatedAttendance,
            days: {
              ...updatedAttendance.days,
              [data.dayNumber.toString()]: {
                attended: true,
                timestamp: new Date().toISOString()
              }
            }
          };

          return {
            ...prev,
            attendance: newAttendance,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
          };
        });
      }

      toast.success(`Asistencia confirmada para Día ${data.dayNumber}`);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al confirmar asistencia';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar datos
  const clearData = () => {
    setInviteeData(null);
    setError(null);
  };

  return {
    fetchInviteeByQR,
    confirmAttendance,
    clearData,
    inviteeData,
    isLoading,
    error,
  };
}