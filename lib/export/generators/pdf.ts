/**
 * Generador de archivos PDF con jsPDF y autoTable
 * Migrado y mejorado del hook useInviteesPDF
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportData, PDFOptions } from '../types';
import { formatValueByType } from '../utils';

/**
 * Genera y descarga un archivo PDF
 */
export function generatePDF(
  data: ExportData,
  filename: string,
  options: PDFOptions = {},
): void {
  const { schema, rows } = data;

  // Auto-detectar orientación según número de columnas
  const autoLandscape = schema.columns.length > 8;
  const landscape = options.landscape ?? autoLandscape;

  // Crear documento PDF
  const doc = new jsPDF({
    orientation: landscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Dimensiones de página
  const pageWidth = landscape ? 297 - 30 : 210 - 30; // A4 - márgenes
  const pageHeight = landscape ? 210 : 297;

  // --- HEADER ---
  // Fondo violeta
  doc.setFillColor(139, 63, 255);
  doc.rect(0, 0, landscape ? 297 : 210, 35, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LISTA DE INVITADOS', landscape ? 148.5 : 105, 15, {
    align: 'center',
  });

  // Subtítulo
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const subtitle = options.eventName || 'JUVECONF 2025';
  doc.text(subtitle, landscape ? 148.5 : 105, 23, { align: 'center' });

  // Fecha de generación
  doc.setFontSize(9);
  const generatedDate =
    options.generatedAt || new Date().toLocaleDateString('es-AR');
  doc.text(
    `Generado: ${generatedDate}`,
    landscape ? 148.5 : 105,
    29,
    { align: 'center' }
  );

  // --- CALCULAR ANCHOS DE COLUMNA ---
  const totalWeight = schema.columns.reduce(
    (sum, col) => sum + (col.width || 15),
    0,
  );

  const columnStyles: any = {};
  schema.columns.forEach((col, index) => {
    const proportion = (col.width || 15) / totalWeight;
    columnStyles[index] = {
      cellWidth: pageWidth * proportion,
      halign: col.type === 'boolean' ? 'center' : 'left',
      fontSize: 8,
    };
  });

  // --- PREPARAR DATOS ---
  // Headers dinámicos
  const headers = [schema.columns.map((col) => col.label)];

  // Datos dinámicos con formateo por tipo
  const tableData = rows.map((row) =>
    schema.columns.map((col) => formatValueByType(row[col.key], col.type)),
  );

  // --- GENERAR TABLA ---
  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: [139, 63, 255],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles,
    // Dibujar líneas en celdas vacías para llenar manual
    didDrawCell: (data) => {
      if (
        data.section === 'body' &&
        data.column.index > 3 && // Solo en columnas de asistencia/merch
        (!data.cell.raw || data.cell.raw === '')
      ) {
        const { x, y, width, height } = data.cell;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        // Línea horizontal para marcar manual
        doc.line(x + 2, y + height / 2, x + width - 2, y + height / 2);
      }
    },
    margin: { left: 15, right: 15 },
  });

  // --- FOOTER ---
  const pageCount = (doc as any).internal.pages.length - 1;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);

    // Número de página
    doc.text(
      `Página ${i} de ${pageCount}`,
      landscape ? 148.5 : 105,
      pageHeight - 10,
      { align: 'center' },
    );

    // Marca de agua
    doc.setFontSize(7);
    doc.text(
      'Generado con JUVECONF System',
      landscape ? 148.5 : 105,
      pageHeight - 5,
      { align: 'center' },
    );
  }

  // --- INFORMACIÓN ADICIONAL ---
  // Agregar página con instrucciones si hay muchas columnas
  if (schema.columns.length > 12) {
    doc.addPage();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Información sobre las columnas', 15, 20);

    doc.setFontSize(9);
    let yPos = 30;
    schema.columns.forEach((col, index) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${index + 1}. ${col.label}`, 20, yPos);
      yPos += 6;
    });
  }

  // --- GUARDAR PDF ---
  doc.save(filename);
}
