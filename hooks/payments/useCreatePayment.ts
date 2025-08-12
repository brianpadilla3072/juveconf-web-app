"use client";
import api from "@/lib/axios.config";
import { CreatePaymentDto, Payment } from "@/entities/Payment";
import { useState } from "react";

export function useCreatePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPayment = async (paymentData: CreatePaymentDto): Promise<Payment | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.post("/payments", paymentData);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al crear pago:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPayment, isLoading, error };
}