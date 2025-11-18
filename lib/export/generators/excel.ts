/**
 * Generador de archivos Excel (.xlsx)
 * Extraído de useExportExcel hook
 */

import * as XLSX from 'xlsx';
import { ExportData } from '../types';
import { formatValueByType } from '../utils';

/**
 * Genera y descarga un archivo Excel
 */
export function generateExcel(data: ExportData, filename: string): void {
  const { schema, rows } = data;

  // Construir headers
  const headers = schema.columns.map((col) => col.label);

  // Construir filas de datos con formateo
  const excelRows = rows.map((row) =>
    schema.columns.map((col) => {
      const value = row[col.key];

      // Formatear según tipo
      if (col.type === 'boolean') {
        return value === 'Sí' || value === true ? 'Sí' : 'No';
      }
      if (col.type === 'date' && value) {
        try {
          return new Date(value).toLocaleDateString('es-AR');
        } catch {
          return value;
        }
      }
      return value || '';
    }),
  );

  // Generar hoja de Excel
  const ws = XLSX.utils.aoa_to_sheet([headers, ...excelRows]);

  // Aplicar anchos de columna
  ws['!cols'] = schema.columns.map((col) => ({
    wch: col.width || 15,
  }));

  // Aplicar estilos a headers (bold y color)
  const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: '8B3FFF' } },
        alignment: { horizontal: 'center' },
      };
    }
  }

  // Crear libro y agregar hoja
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invitados');

  // Descargar archivo
  XLSX.writeFile(wb, filename);
}
