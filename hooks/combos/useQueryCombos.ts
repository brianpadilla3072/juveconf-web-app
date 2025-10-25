"use client";
import api from "@/lib/axios.config";
import { Combo } from "@/entities/Combo";
import { useEffect, useState } from "react";


export function useQueryCombos() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCombos = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/combos");

      // Enrich combos with current price if not already included
      const enrichedCombos = await Promise.all(
        res.data.map(async (combo: Combo) => {
          if (!combo.currentPrice) {
            try {
              const priceRes = await api.get(`/combos/${combo.id}/current-price`);
              return { ...combo, currentPrice: priceRes.data };
            } catch (err) {
              console.warn(`No se pudo obtener precio actual para combo ${combo.id}`);
              return combo;
            }
          }
          return combo;
        })
      );

      setCombos(enrichedCombos);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error al cargar combos:", err);
      // Fallback data for development
      setCombos([
        {
          id: "1",
          name: "Combo Individual",
          price: 15000,
          year: 2025,
          minPersons: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          eventId: "event-1",
        },
        {
          id: "2",
          name: "Combo Familiar",
          price: 45000,
          year: 2025,
          minPersons: 4,
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          eventId: "event-1",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const refetch = () => {
    fetchCombos();
  };

  return { combos, isLoading, error, refetch };
}
