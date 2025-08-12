"use client";
import api from "@/lib/axios.config";
import { PaymentSummary } from "@/entities/Payment";
import { useEffect, useState } from "react";

export function usePaymentsSummary() {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/payments/dashboard/summary");
      setSummary(res.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error al cargar resumen de pagos:", err);
      // Fallback data for development
      setSummary({
        totalAmount: 150000,
        totalPayments: 12,
        paymentsByType: {
          TRANSFER: 8,
          MERCADOPAGO: 3,
          CASH: 1
        },
        recentPayments: [
          {
            id: "1",
            year: 2025,
            orderId: "order-1",
            amount: 15000,
            type: "TRANSFER",
            payerName: "Juan Pérez",
            payerEmail: "juan@test.com",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          {
            id: "2",
            year: 2025,
            orderId: "order-2",
            amount: 45000,
            type: "MERCADOPAGO",
            payerName: "María García",
            payerEmail: "maria@test.com",
            createdAt: "2024-01-02T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z",
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const refetch = () => {
    fetchSummary();
  };

  return { summary, isLoading, error, refetch };
}