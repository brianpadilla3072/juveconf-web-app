"use client";
import { useEffect, useRef, useState } from 'react';
import api from '@/lib/axios.config';
import { extractApiError } from '@/lib/meals';
import type { BuffetView } from '@/entities/Meal';

/**
 * Búsqueda manual por nombre o código (GET /meals/lookup, máx. 10 resultados).
 * `q` ya debería venir con debounce; con menos de `minChars` no hace requests.
 */
export function useBuffetLookup(q: string, slotCode: string | null, minChars = 2) {
  const [results, setResults] = useState<BuffetView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const term = q.trim();
    const requestId = ++requestIdRef.current;

    if (!slotCode || term.length < minChars) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    api
      .get<BuffetView[]>('/meals/lookup', { params: { q: term, slotCode } })
      .then(({ data }) => {
        if (requestId !== requestIdRef.current) return;
        setResults(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setResults([]);
        setError(extractApiError(err, 'No se pudo realizar la búsqueda').message);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });
  }, [q, slotCode, minChars]);

  return { results, isLoading, error };
}

export default useBuffetLookup;
