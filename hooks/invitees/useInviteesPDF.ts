'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface InviteeData {
  id: string;
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  attendedDay1: boolean;
  attendedDay2: boolean;
  payment?: {
    amount: number;
    payerEmail?: string;
  };
  order?: {
    status: string;
  };
}

export function useInviteesPDF() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInviteesPDF = async (
    invitees: InviteeData[], 
    year: number,
    searchFilter?: string
  ) => {
    try {
      setIsGenerating(true);

      // Crear nuevo documento PDF en orientación horizontal
      const doc = new jsPDF({
        orientation: 'landscape',
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

      // Preparar datos para la tabla
      const tableData = invitees.map(invitee => [
        invitee.name,
        invitee.cuil,
        invitee.email || '', // Celda vacía para escribir manualmente
        invitee.phone || '', // Celda vacía para escribir manualmente
        invitee.attendedDay1 ? '☑' : '☐', // Símbolo visual de asistencia
        invitee.attendedDay2 ? '☑' : '☐', // Símbolo visual de asistencia
        '' // Celda vacía para observaciones
      ]);

      // Configurar tabla con autoTable
      autoTable(doc, {
        head: [['Nombre', 'CUIL', 'Email', 'Teléfono', 'Día 1', 'Día 2', 'Observaciones']],
        body: tableData,
        startY: searchFilter ? 50 : 45,
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
        columnStyles: {
          0: { cellWidth: 45 }, // Nombre - más ancho
          1: { cellWidth: 30 }, // CUIL
          2: { cellWidth: 40 }, // Email - espacio para escribir
          3: { cellWidth: 35 }, // Teléfono - espacio para escribir  
          4: { cellWidth: 15, halign: 'center' }, // Día 1 - centrado
          5: { cellWidth: 15, halign: 'center' }, // Día 2 - centrado
          6: { cellWidth: 50 } // Observaciones - más ancho para escribir
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245] // Gris claro alternado
        },
        margin: { top: 20, left: 20, right: 20 },
        didDrawCell: function(data) {
          // Agregar líneas adicionales en celdas vacías para facilitar escritura manual
          if ((data.column.index === 2 || data.column.index === 3 || data.column.index === 6) && 
              data.cell.raw === '') {
            const cellHeight = data.cell.height;
            const cellY = data.cell.y;
            const cellX = data.cell.x;
            const cellWidth = data.cell.width;
            
            // Dibujar línea sutil en celdas vacías
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