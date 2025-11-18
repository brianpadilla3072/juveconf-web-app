'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios.config';
import { toast } from 'sonner';
import {
  ExportFormat,
  ExportConfig,
  ExportData,
  FORMAT_LABELS,
  FORMAT_EXTENSIONS,
  PDFOptions,
} from '@/lib/export/types';
import { generateSafeFilename } from '@/lib/export/utils';
import { generateExcel } from '@/lib/export/generators/excel';
import { generatePDF } from '@/lib/export/generators/pdf';
import { generateCSV } from '@/lib/export/generators/csv';
import { generateJSON } from '@/lib/export/generators/json';

export interface ExportOptions {
  pdfLandscape?: boolean;
  eventName?: string;
}

/**
 * Hook unificado para exportación multi-formato
 * Soporta: Excel, PDF, CSV, JSON (flat y nested)
 */
export function useMultiFormatExport() {
  const [isGenerating, setIsGenerating] = useState(false);

  // Mutation para obtener datos del backend
  const generateDataMutation = useMutation({
    mutationFn: async (config: ExportConfig): Promise<ExportData> => {
      const response = await api.post('/invitees/export/generate', config);
      return response.data;
    },
  });

  /**
   * Exporta datos en el formato especificado
   */
  const exportData = async (
    config: ExportConfig,
    format: ExportFormat,
    options: ExportOptions = {},
  ) => {
    try {
      setIsGenerating(true);
      toast.loading(`Generando exportación ${FORMAT_LABELS[format]}...`);

      // Obtener datos del backend (igual para todos los formatos)
      const data = await generateDataMutation.mutateAsync(config);

      if (data.rows.length === 0) {
        toast.dismiss();
        toast.warning('No hay invitados para exportar');
        return;
      }

      // Generar nombre de archivo
      const extension = FORMAT_EXTENSIONS[format];
      const filename = generateSafeFilename(config.eventId, extension);

      // Despachar según formato seleccionado
      switch (format) {
        case 'excel':
          generateExcel(data, filename);
          break;

        case 'pdf':
          const pdfOptions: PDFOptions = {
            landscape: options.pdfLandscape,
            eventName: options.eventName,
            generatedAt: new Date().toLocaleDateString('es-AR'),
          };
          generatePDF(data, filename, pdfOptions);
          break;

        case 'csv':
          generateCSV(data, filename);
          break;

        case 'json':
          generateJSON(data, filename, false); // Flat
          break;

        case 'json-nested':
          generateJSON(data, filename, true); // Nested
          break;

        default:
          throw new Error(`Formato no soportado: ${format}`);
      }

      toast.dismiss();
      toast.success(
        `Exportación ${FORMAT_LABELS[format]} completada: ${data.rows.length} invitados, ${data.schema.columns.length} columnas`,
      );
    } catch (error: any) {
      toast.dismiss();
      const errorMessage =
        error.response?.data?.message || 'Error al generar exportación';
      toast.error(errorMessage);
      console.error('Error en exportación:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    exportData,
    isGenerating,
  };
}
