"use client";
import api from "@/lib/axios.config";
import { Combo } from "@/entities/Combo";
import { useState } from "react";

export function useDeleteCombo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteCombo = async (comboId: string): Promise<Combo | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.delete(`/combos/${comboId}`);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al eliminar combo:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteCombo, isLoading, error };
}