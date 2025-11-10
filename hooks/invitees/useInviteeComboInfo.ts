'use client';

import { useState, useEffect } from 'react';
import { ComboInfo } from '@/entities/ComboInfo';
import axios from '@/lib/axios.config';

interface UseInviteeComboInfoResult {
  comboInfo: ComboInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInviteeComboInfo(inviteeId: string): UseInviteeComboInfoResult {
  const [comboInfo, setComboInfo] = useState<ComboInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComboInfo = async () => {
    if (!inviteeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/invitees/${inviteeId}/combo-info`);
      
      if (response.data) {
        setComboInfo(response.data);
      } else {
        setComboInfo({
          hasCombo: false,
          message: 'No se pudo obtener información del combo'
        });
      }
    } catch (err) {
      console.error('Error fetching combo info:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('Invitado no encontrado');
        } else if (err.response?.status === 403) {
          setError('No tienes permisos para ver esta información');
        } else {
          setError(err.response?.data?.message || 'Error al obtener información del combo');
        }
      } else {
        setError('Error de conexión');
      }
      
      setComboInfo({
        hasCombo: false,
        message: 'Error al cargar información del combo'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComboInfo();
  }, [inviteeId]);

  return {
    comboInfo,
    loading,
    error,
    refetch: fetchComboInfo
  };
}