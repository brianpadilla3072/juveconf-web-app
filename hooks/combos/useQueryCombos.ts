"use client";
import api from "@/config/axiosInstance";
import { useEffect, useState } from "react";

export interface Combo {
  id: string;
  name: string;
  minPersons: number;
  maxPersons: number;
  price: number;
}


export function useQueryCombos() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await api.get("/combos");
        setCombos(res.data);
      } catch (err: any) {
        setError(err);
        console.error("Error al cargar combos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCombos();
  }, []);

  return { combos, isLoading, error };
}
