/**
 * Helpers de roles para la sección de Comidas.
 * Hoy el frontend no tiene control de acceso por rol en el resto de los módulos:
 * esto solo cubre lo necesario para Comidas y para el rol BUFFET.
 */

/** Roles que administran Comidas (configuración, registros, conteos) */
export const MEALS_ADMIN_ROLES = ['ADMIN', 'DEVELOPER', 'SUPERADMIN'] as const;

/** Roles que pueden operar el modo buffet */
export const BUFFET_ROLES = [...MEALS_ADMIN_ROLES, 'COLLABORATOR', 'BUFFET'] as const;

export const BUFFET_HOME_PATH = '/app/comidas/buffet';
export const APP_HOME_PATH = '/app';

export function isMealsAdminRole(role?: string | null): boolean {
  return !!role && (MEALS_ADMIN_ROLES as readonly string[]).includes(role);
}

export function canUseBuffetRole(role?: string | null): boolean {
  return !!role && (BUFFET_ROLES as readonly string[]).includes(role);
}

/** El rol BUFFET solo ve el modo buffet (layout mínimo, sin sidebar) */
export function isBuffetOnlyRole(role?: string | null): boolean {
  return role === 'BUFFET';
}

/** Ruta a la que se redirige a cada rol después de iniciar sesión */
export function homePathForRole(role?: string | null): string {
  return isBuffetOnlyRole(role) ? BUFFET_HOME_PATH : APP_HOME_PATH;
}

export function isBuffetPath(pathname?: string | null): boolean {
  return !!pathname && (pathname === BUFFET_HOME_PATH || pathname.startsWith(`${BUFFET_HOME_PATH}/`));
}
