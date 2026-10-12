"use client";
import { useAuth } from '@/contexts/AuthContext';
import {
  canUseBuffetRole,
  isBuffetOnlyRole,
  isMealsAdminRole,
} from '@/lib/roles';

/** Rol del usuario actual y permisos derivados para la sección de Comidas */
export function useRole() {
  const { user, isLoading } = useAuth();
  const role = user?.role ?? null;

  return {
    role,
    isLoading,
    isMealsAdmin: isMealsAdminRole(role),
    canUseBuffet: canUseBuffetRole(role),
    isBuffetOnly: isBuffetOnlyRole(role),
  };
}

export default useRole;
