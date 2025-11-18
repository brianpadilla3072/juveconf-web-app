/**
 * Generador de archivos CSV
 * Cumple con RFC 4180 para máxima compatibilidad
 */

import { ExportData } from '../types';
import { downloadFile, formatValueByType } from '../utils';

/**
 * Genera y descarga un archivo CSV
 */
export function generateCSV(data: ExportData, filename: string): void {
  const { schema, rows } = data;

  // Headers
  const headers = schema.columns.map((col) => col.label);

  // Rows con escape RFC 4180
  const csvRows = rows.map((row) =>
    schema.columns.map((col) => {
      const value = formatValueByType(row[col.key], col.type);
      return escapeCsvValue(value);
    }).join(',')
  );

  // BOM para compatibilidad con Excel en Windows
  const csv = '\uFEFF' + [headers.join(','), ...csvRows].join('\n');

  // Descargar archivo
  downloadFile(csv, filename, 'text/csv;charset=utf-8');
}

/**
 * Escapa un valor para CSV según RFC 4180
 * - Si contiene coma, comillas o salto de línea, se encierra entre comillas
 * - Las comillas internas se duplican
 */
function escapeCsvValue(value: string): string {
  if (!value) return '';

  const str = String(value);

  // Necesita escapado si contiene: coma, comillas, salto de línea o retorno de carro
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    // Duplicar comillas internas y encerrar todo entre comillas
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}
