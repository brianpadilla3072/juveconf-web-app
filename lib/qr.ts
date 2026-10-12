/**
 * Utilidades compartidas para leer el QR de la entrada.
 *
 * El QR de la entrada codifica un texto con el formato:
 *   inviteId: <uuid>
 *   paymentId: <uuid>
 * Lo usan el escáner de asistencia y el escáner del buffet.
 */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export interface ParsedTicketQR {
  inviteId: string;
  paymentId?: string;
}

/**
 * Extrae inviteId (obligatorio) y paymentId (opcional) del texto del QR.
 * Lanza un Error con mensaje en español si el contenido no es válido.
 */
export function parseTicketQR(decodedText: string): ParsedTicketQR {
  // Limpiar el texto del QR
  const cleanText = decodedText.trim();

  // Usar regex para extraer inviteId y paymentId del formato de objeto JavaScript
  const inviteIdMatch = cleanText.match(/inviteId:\s*([a-f0-9-]{36})/i);
  const paymentIdMatch = cleanText.match(/paymentId:\s*([a-f0-9-]{36})/i);

  // El inviteId es obligatorio, paymentId es opcional
  if (!inviteIdMatch) {
    throw new Error('No se encontró inviteId válido en el QR');
  }

  const inviteId = inviteIdMatch[1];
  const paymentId = paymentIdMatch ? paymentIdMatch[1] : undefined;

  // Validar que inviteId sea UUID válido (formato básico)
  if (!isUuid(inviteId)) {
    throw new Error('inviteId inválido en el QR');
  }

  // Validar paymentId solo si existe
  if (paymentId && !isUuid(paymentId)) {
    throw new Error('paymentId inválido en el QR');
  }

  return { inviteId, paymentId };
}

const REGISTRATION_CODE_REGEX = /^[A-Z]{1,6}-\d{1,8}$/i;

/**
 * Devuelve el código de inscripción normalizado (ej: "JC-0247") si el texto tiene
 * ese formato (tipeado a mano o leído de un QR simple); si no, null.
 */
export function parseRegistrationCode(text: string): string | null {
  const clean = text.trim();
  return REGISTRATION_CODE_REGEX.test(clean) ? clean.toUpperCase() : null;
}
