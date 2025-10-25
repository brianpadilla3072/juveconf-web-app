"use client";
import api from "@/lib/axios.config";
import { CreatePreSaleDto, PreSale } from "@/entities/PreSale";
import { useState } from "react";

export function useCreatePreSale() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPreSale = async (preSaleData: CreatePreSaleDto): Promise<PreSale | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await api.post("/presales", preSaleData);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al crear preventa:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPreSale, isLoading, error };
}
