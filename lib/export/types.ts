/**
 * Tipos compartidos para el sistema de exportación multi-formato
 */

export type ExportFormat = 'excel' | 'pdf' | 'csv' | 'json' | 'json-nested';

export interface ExportColumn {
  key: string;
  label: string;
  type: string;
  width?: number;
}

export interface ExportSchema {
  columns: ExportColumn[];
}

export interface ExportData {
  schema: ExportSchema;
  rows: Record<string, any>[];
}

export interface PDFOptions {
  landscape?: boolean;
  eventName?: string;
  generatedAt?: string;
}

export interface ExportConfig {
  eventId: string;
  comboIds?: string[];
  includeAttendance?: boolean;
  includeMerchandising?: boolean;
  includeMetadata?: boolean;
  selectedMetadataFields?: string[];
  selectedMerchTypes?: string[];
  selectedAdditionalFields?: string[];
}

export const FORMAT_LABELS: Record<ExportFormat, string> = {
  excel: 'Excel',
  pdf: 'PDF',
  csv: 'CSV',
  json: 'JSON',
  'json-nested': 'JSON (estructura técnica)',
};

export const FORMAT_EXTENSIONS: Record<ExportFormat, string> = {
  excel: 'xlsx',
  pdf: 'pdf',
  csv: 'csv',
  json: 'json',
  'json-nested': 'json',
};
