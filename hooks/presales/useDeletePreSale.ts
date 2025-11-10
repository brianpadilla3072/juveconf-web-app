"use client";
import api from "@/lib/axios.config";
import { useState } from "react";

export function useDeletePreSale() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePreSale = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await api.delete(`/presales/${id}`);
      return true;
    } catch (err: any) {
      setError(err);
      console.error("Error al eliminar preventa:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePreSale, isLoading, error };
}
