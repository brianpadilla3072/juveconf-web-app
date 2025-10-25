"use client";
import api from "@/lib/axios.config";
import { PreSale } from "@/entities/PreSale";
import { useEffect, useState } from "react";

export function useQueryActivePreSales() {
  const [preSales, setPreSales] = useState<PreSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivePreSales = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/presales/active");
      setPreSales(res.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error al cargar preventas activas:", err);
      setPreSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePreSales();
  }, []);

  const refetch = () => {
    fetchActivePreSales();
  };

  return { preSales, isLoading, error, refetch };
}
