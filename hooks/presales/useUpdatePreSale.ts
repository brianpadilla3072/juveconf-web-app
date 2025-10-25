"use client";
import api from "@/lib/axios.config";
import { UpdatePreSaleDto, PreSale } from "@/entities/PreSale";
import { useState } from "react";

export function useUpdatePreSale() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePreSale = async (id: string, preSaleData: UpdatePreSaleDto): Promise<PreSale | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await api.patch(`/presales/${id}`, preSaleData);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al actualizar preventa:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePreSale, isLoading, error };
}
