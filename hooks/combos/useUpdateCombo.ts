"use client";
import api from "@/lib/axios.config";
import { UpdateComboDto, Combo } from "@/entities/Combo";
import { useState } from "react";

export function useUpdateCombo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCombo = async (comboId: string, comboData: UpdateComboDto): Promise<Combo | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.patch(`/combos/${comboId}`, comboData);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al actualizar combo:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateCombo, isLoading, error };
}