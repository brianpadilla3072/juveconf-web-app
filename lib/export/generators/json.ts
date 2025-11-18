/**
 * Generador de archivos JSON
 * Ofrece dos variantes: flat (legible) y nested (técnico)
 */

import { ExportData } from '../types';
import { downloadFile } from '../utils';

/**
 * Genera y descarga un archivo JSON
 * @param data - Datos de exportación
 * @param filename - Nombre del archivo
 * @param nested - Si true, usa estructura técnica; si false, usa estructura legible
 */
export function generateJSON(
  data: ExportData,
  filename: string,
  nested: boolean = false,
): void {
  const { schema, rows } = data;

  const jsonData = nested ? generateNestedJSON(rows) : generateFlatJSON(schema, rows);

  // Pretty print con 2 espacios de indentación
  const json = JSON.stringify(jsonData, null, 2);

  // Descargar archivo
  downloadFile(json, filename, 'application/json;charset=utf-8');
}

/**
 * JSON flat - Para humanos
 * Usa labels de columnas como keys
 * Ejemplo: { "Nombre": "Juan", "CUIL": "20-12345678-9", "Día 1": "Sí" }
 */
function generateFlatJSON(
  schema: ExportData['schema'],
  rows: ExportData['rows'],
): Record<string, any>[] {
  return rows.map((row) => {
    const obj: Record<string, any> = {};
    schema.columns.forEach((col) => {
      obj[col.label] = row[col.key];
    });
    return obj;
  });
}

/**
 * JSON nested - Para desarrolladores
 * Usa estructura técnica con keys originales
 * Ejemplo: { "name": "Juan", "cuil": "20-12345678-9", "attendance": { "1": true } }
 */
function generateNestedJSON(rows: ExportData['rows']): Record<string, any>[] {
  return rows.map((row) => {
    const obj: Record<string, any> = {};

    Object.entries(row).forEach(([key, value]) => {
      // Reconstruir estructura nested
      if (key.startsWith('metadata.')) {
        if (!obj.metadata) obj.metadata = {};
        const fieldKey = key.replace('metadata.', '');
        obj.metadata[fieldKey] = value;
      } else if (key.startsWith('merch.')) {
        if (!obj.merchandising) obj.merchandising = {};
        const merchType = key.replace('merch.', '');
        obj.merchandising[merchType] = value;
      } else if (key.startsWith('attendance.')) {
        if (!obj.attendance) obj.attendance = {};
        const dayNumber = key.replace('attendance.', '');
        obj.attendance[dayNumber] = value === 'Sí' || value === true;
      } else {
        obj[key] = value;
      }
    });

    return obj;
  });
}
