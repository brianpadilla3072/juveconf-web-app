"use client";
import api from "@/lib/axios.config";
import { Payment } from "@/entities/Payment";
import { useEffect, useState } from "react";

export function useQueryPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/payments");
      setPayments(res.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error al cargar pagos:", err);
      // Fallback data for development
      setPayments([
        {
          id: "1",
          year: 2025,
          orderId: "order-1",
          amount: 15000,
          type: "TRANSFER",
          externalReference: "TXN001",
          payerName: "Juan Pérez",
          payerEmail: "juan@test.com",
          payerDni: "12345678",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          order: {
            id: "order-1",
            year: 2025,
            total: 15000,
            status: "PAID",
            email: "juan@test.com",
            cuil: "12345678"
          }
        },
        {
          id: "2",
          year: 2025,
          orderId: "order-2",
          amount: 45000,
          type: "MERCADOPAGO",
          externalReference: "MP001",
          payerName: "María García",
          payerEmail: "maria@test.com",
          payerDni: "87654321",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          order: {
            id: "order-2",
            year: 2025,
            total: 45000,
            status: "PAID",
            email: "maria@test.com",
            cuil: "87654321"
          }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const refetch = () => {
    fetchPayments();
  };

  return { payments, isLoading, error, refetch };
}