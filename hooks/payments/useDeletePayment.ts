"use client";
import api from "@/lib/axios.config";
import { Payment } from "@/entities/Payment";
import { useState } from "react";

export function useDeletePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePayment = async (paymentId: string): Promise<Payment | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.delete(`/payments/${paymentId}`);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al eliminar pago:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePayment, isLoading, error };
}