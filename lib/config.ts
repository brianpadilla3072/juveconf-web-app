/**
 * Configuración centralizada de URLs externas para JuveConf Web App
 * Este archivo maneja las URLs del sitio estático y otros servicios externos
 */

export const EXTERNAL_URLS = {
  /**
   * URL del sitio estático de JuveConf (Astro)
   * - Local: http://localhost:4321
   * - Producción: https://www.juveconfe.com
   */
  staticSite: process.env.NEXT_PUBLIC_STATIC_SITE_URL || 'http://localhost:4321',

  /**
   * URL de la API (ya configurada en constants.ts)
   */
  api: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3072',
} as const;

/**
 * Genera URL de descarga de ticket
 * @param paymentId - ID del pago
 * @returns URL completa para descargar la entrada
 */
export const getTicketDownloadUrl = (paymentId: string): string => {
  return `${EXTERNAL_URLS.staticSite}/ticket/${paymentId}`;
};

/**
 * Genera URL del sitio estático
 * @param path - Ruta opcional (ej: "/inscripcion")
 * @returns URL completa del sitio estático
 */
export const getStaticSiteUrl = (path = ''): string => {
  return `${EXTERNAL_URLS.staticSite}${path}`;
};
