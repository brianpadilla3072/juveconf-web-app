"use client";
import api from "@/lib/axios.config";
import { PreSale } from "@/entities/PreSale";
import { useEffect, useState } from "react";

export function useQueryPreSales() {
  const [preSales, setPreSales] = useState<PreSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPreSales = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/presales");
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
  }, []);

  const refetch = () => {
    fetchPreSales();
  };

  return { preSales, isLoading, error, refetch };
}
