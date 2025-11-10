'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';
import { Invitee } from '@/entities/Invitee';
import { Event } from '@/entities/Event';

export function useInviteesPDF() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInviteesPDF = async (
    invitees: Invitee[],
    year: number,
    event?: Event | null,
    searchFilter?: string
  ) => {
    try {
      setIsGenerating(true);

      // Obtener días del evento (dinámico)
      const eventDays = event?.eventDays?.days || [];
      const hasDays = eventDays.length > 0;

      // Crear nuevo documento PDF en orientación vertical
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Configurar fecha actual
      const currentDate = new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Título principal
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`LISTA DE INVITADOS - ${year}`, 20, 20);

      // Información adicional
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado: ${currentDate}`, 20, 30);
      doc.text(`Total de invitados: ${invitees.length}`, 20, 35);

      if (searchFilter) {
        doc.text(`Filtro aplicado: "${searchFilter}"`, 20, 40);
      }

      if (hasDays && event) {
        doc.text(`Evento: ${event.topic || 'Sin nombre'}`, 20, 45);
      }

      // Preparar headers dinámicamente
      const baseHeaders = ['Nombre', 'CUIL', 'Email', 'Teléfono'];
      const dayHeaders = hasDays
        ? eventDays.map(day => day.label || `Día ${day.dayNumber}`)
        : ['Día 1', 'Día 2']; // Fallback si no hay evento
      const headers = [...baseHeaders, ...dayHeaders, 'Observaciones'];

      // Preparar datos para la tabla
      const tableData = invitees.map(invitee => {
        const baseData = [
          invitee.name,
          invitee.cuil,
          invitee.email || '',
          invitee.phone || ''
        ];

        // Agregar columnas vacías para cada día del evento
        const dayColumns = hasDays
          ? eventDays.map(() => '')
          : ['', '']; // Fallback 2 días

        return [...baseData, ...dayColumns, ''];
      });

      // Configurar estilos de columnas dinámicamente
      const columnStyles: { [key: number]: any } = {
        0: { cellWidth: 38 }, // Nombre
        1: { cellWidth: 27 }, // CUIL
        2: { cellWidth: 32 }, // Email
        3: { cellWidth: 27 }, // Teléfono
      };

      // Calcular ancho disponible para días y observaciones
      const totalBaseWidth = 38 + 27 + 32 + 27; // 124mm
      const pageWidth = 210 - 16; // A4 width - margins (194mm)
      const remainingWidth = pageWidth - totalBaseWidth; // ~70mm
      const observationsWidth = 25; // Fijo para observaciones
      const daysWidth = remainingWidth - observationsWidth; // ~45mm
      const dayColumnWidth = hasDays
        ? daysWidth / eventDays.length
        : daysWidth / 2; // Distribuir equitativamente

      // Agregar estilos para columnas de días
      dayHeaders.forEach((_, index) => {
        const colIndex = 4 + index;
        columnStyles[colIndex] = {
          cellWidth: dayColumnWidth,
          halign: 'center'
        };
      });

      // Estilo para observaciones (última columna)
      columnStyles[headers.length - 1] = { cellWidth: observationsWidth };

      // Configurar tabla con autoTable
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: hasDays && event ? 55 : (searchFilter ? 50 : 45),
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak',
          halign: 'left',
          valign: 'middle'
        },
        headStyles: {
          fillColor: [41, 128, 185], // Azul
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles,
        alternateRowStyles: {
          fillColor: [245, 245, 245] // Gris claro alternado
        },
        margin: { top: 20, left: 8, right: 8 },
        didDrawCell: function(data) {
          // Agregar líneas adicionales en celdas vacías para facilitar escritura manual
          const isEmptyDataCell = (
            data.column.index >= 2 && // Email en adelante
            data.cell.raw === ''
          );

          if (isEmptyDataCell) {
            const cellHeight = data.cell.height;
            const cellY = data.cell.y;
            const cellX = data.cell.x;
            const cellWidth = data.cell.width;

            // Dibujar línea sutil en celdas vacías para escritura manual
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.1);
            doc.line(cellX + 2, cellY + cellHeight - 2, cellX + cellWidth - 2, cellY + cellHeight - 2);
          }
        }
      });

      // Agregar pie de página con información adicional
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Página ${i} de ${pageCount} | Lista generada desde sistema de gestión`,
          20,
          doc.internal.pageSize.height - 10
        );
      }

      // Generar nombre de archivo
      const fileName = `lista_invitados_${year}_${new Date().toISOString().split('T')[0]}.pdf`;

      // Descargar el PDF
      doc.save(fileName);

      toast.success(`PDF generado correctamente: ${fileName}`);

    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF. Intente nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateInviteesPDF,
    isGenerating
  };
}
