/**
 * Utilidades compartidas para exportación de datos
 */

/**
 * Descarga un archivo en el navegador
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string,
): void {
  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formatea un valor según su tipo para exportación
 */
export function formatValueByType(value: any, type: string): string {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'boolean':
      return value === true || value === 'Sí' ? 'Sí' : '';

    case 'date':
      if (!value) return '';
      try {
        return new Date(value).toLocaleDateString('es-AR');
      } catch {
        return String(value);
      }

    case 'number':
      return value !== '' ? String(value) : '';

    default:
      return String(value);
  }
}

/**
 * Genera un nombre de archivo seguro
 */
export function generateSafeFilename(
  eventId: string,
  extension: string,
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const eventSlug = eventId.substring(0, 8);
  return `invitados_${eventSlug}_${timestamp}.${extension}`;
}
