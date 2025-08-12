"use client";
import api from "@/lib/axios.config";
import { UpdatePaymentDto, Payment } from "@/entities/Payment";
import { useState } from "react";

export function useUpdatePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePayment = async (paymentId: string, paymentData: UpdatePaymentDto): Promise<Payment | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.put(`/payments/${paymentId}`, paymentData);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al actualizar pago:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePayment, isLoading, error };
}