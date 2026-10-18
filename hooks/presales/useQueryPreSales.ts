"use client";
import api from "@/lib/axios.config";
import { PreSale } from "@/entities/PreSale";
import { useEffect, useState } from "react";

export function useQueryPreSales(year?: number, eventId?: string) {
  const [preSales, setPreSales] = useState<PreSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPreSales = async () => {
    try {
      setIsLoading(true);
      const params = { ...(eventId ? { eventId } : year ? { year } : {}) };
      const res = await api.get("/presales", { params });
      setPreSales(res.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error al cargar preventas:", err);
      setPreSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreSales();
  }, [year, eventId]);

  const refetch = () => {
    fetchPreSales();
  };

  return { preSales, isLoading, error, refetch };
}
