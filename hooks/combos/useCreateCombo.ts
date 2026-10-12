"use client";
import api from "@/lib/axios.config";
import { CreateComboDto, Combo } from "@/entities/Combo";
import { useState } from "react";
import { toast } from "sonner";
import { extractApiError } from "@/lib/meals";

export function useCreateCombo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCombo = async (comboData: CreateComboDto): Promise<Combo | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.post("/combos", comboData);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al crear combo:", err);
      // Muestra el mensaje del servidor (ej: 400 al activar comidas sin menús configurados)
      toast.error(extractApiError(err, "Error al crear combo").message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCombo, isLoading, error };
}