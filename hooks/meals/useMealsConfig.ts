"use client";
import { useState } from 'react';
import api from '@/lib/axios.config';
import { toast } from 'sonner';
import { extractApiError } from '@/lib/meals';
import { refreshCurrentEvent } from '@/hooks/Events/useCurrentEvent';
import type {
  MealsConfigResponse,
  UpdateMealsConfigPayload,
} from '@/entities/Meal';

interface SaveConfigOptions {
  successMessage?: string;
}

/**
 * Guarda la configuración de comidas de un evento (PATCH /meals/config/:eventId).
 * Es la única vía para modificar `mealConfig`: nunca se envía por /events.
 * La activación de comidas es por combo (`mealsEnabled` en /combos).
 */
export function useMealsConfig() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const clearErrors = () => {
    setError(null);
    setErrors([]);
  };

  const saveConfig = async (
    eventId: string,
    payload: UpdateMealsConfigPayload,
    options: SaveConfigOptions = {},
  ): Promise<MealsConfigResponse | null> => {
    try {
      setIsSaving(true);
      clearErrors();

      const { data } = await api.patch<MealsConfigResponse>(
        `/meals/config/${eventId}`,
        payload,
      );
      toast.success(options.successMessage ?? 'Configuración de comidas guardada');

      // Actualiza el evento compartido (sidebar y demás pantallas)
      await refreshCurrentEvent();
      return data;
    } catch (err: any) {
      const info = extractApiError(err, 'Error al guardar la configuración de comidas');
      setError(info.message);
      setErrors(info.errors);
      toast.error(info.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveConfig, isSaving, error, errors, clearErrors };
}

export default useMealsConfig;
