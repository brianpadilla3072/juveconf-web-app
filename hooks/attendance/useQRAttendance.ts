'use client';

import { useState } from 'react';
import api from '@/lib/axios.config';
import { toast } from 'sonner';

interface QRData {
  inviteId: string;
  paymentId: string;
}

interface InviteeData {
  id: string;
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  attendedDay1: boolean;
  attendedDay2: boolean;
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
  day: 'day1' | 'day2';
  email?: string;
  phone?: string;
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
      
      // Verificar que el paymentId coincida
      if (response.data.paymentId !== qrData.paymentId) {
        throw new Error('Los datos del QR no coinciden con el invitado');
      }

      const invitee: InviteeData = {
        id: response.data.id,
        name: response.data.name,
        cuil: response.data.cuil,
        email: response.data.email,
        phone: response.data.phone,
        attendedDay1: response.data.attendedDay1,
        attendedDay2: response.data.attendedDay2,
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

      // Actualizar asistencia
      const attendanceData = {
        [data.day === 'day1' ? 'day1' : 'day2']: true
      };

      await api.patch(`/invitees/${data.inviteeId}/attendance`, attendanceData);

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
        setInviteeData(prev => prev ? {
          ...prev,
          attendedDay1: data.day === 'day1' ? true : prev.attendedDay1,
          attendedDay2: data.day === 'day2' ? true : prev.attendedDay2,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
        } : null);
      }

      const dayText = data.day === 'day1' ? 'Día 1' : 'Día 2';
      toast.success(`Asistencia confirmada para ${dayText}`);
      
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