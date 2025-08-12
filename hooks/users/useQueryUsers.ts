"use client";
import api from "@/lib/axios.config";
import { User } from "@/entities/User";
import { useEffect, useState } from "react";

export function useQueryUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error al cargar usuarios:", err);
      // Fallback data for development
      setUsers([
        {
          id: "1",
          provider: "LOCAL",
          dni: "12345678",
          name: "Juan Pérez",
          givenName: "Juan",
          familyName: "Pérez",
          email: "juan@test.com",
          emailVerified: true,
          role: "USER",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          provider: "LOCAL",
          dni: "87654321",
          name: "María García",
          givenName: "María",
          familyName: "García",
          email: "maria@test.com",
          emailVerified: false,
          role: "ADMIN",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refetch = () => {
    fetchUsers();
  };

  return { users, isLoading, error, refetch };
}