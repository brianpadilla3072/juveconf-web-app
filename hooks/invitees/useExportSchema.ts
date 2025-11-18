'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios.config';

export interface MetadataField {
  key: string;
  label: string;
  type: string;
  sampleValues?: any[];
}

export interface MerchType {
  type: string;
  label: string;
  sizes: string[];
}

/**
 * Hook para obtener el esquema dinámico de exportación
 * Descubre automáticamente los campos de metadata y tipos de merchandising
 */
export function useExportSchema(eventId?: string) {
  // Obtener campos de metadata descubiertos dinámicamente
  const {
    data: metadataFields,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useQuery<MetadataField[]>({
    queryKey: ['export-schema', 'metadata', eventId],
    queryFn: async () => {
      const response = await api.get('/invitees/schema/metadata', {
        params: eventId ? { eventId } : {},
      });
      return response.data;
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    gcTime: 10 * 60 * 1000, // Garbage collection después de 10 minutos
  });

  // Obtener tipos de merchandising descubiertos dinámicamente
  const {
    data: merchTypes,
    isLoading: isLoadingMerch,
    error: merchError,
  } = useQuery<MerchType[]>({
    queryKey: ['export-schema', 'merchandise', eventId],
    queryFn: async () => {
      const response = await api.get('/invitees/schema/merchandise', {
        params: { eventId },
      });
      return response.data;
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    metadataFields: metadataFields || [],
    merchTypes: merchTypes || [],
    isLoading: isLoadingMetadata || isLoadingMerch,
    error: metadataError || merchError,
  };
}
