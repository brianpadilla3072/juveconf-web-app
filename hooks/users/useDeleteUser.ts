"use client";
import api from "@/lib/axios.config";
import { User } from "@/entities/User";
import { useState } from "react";

export function useDeleteUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteUser = async (userId: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.delete(`/users/${userId}`);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al eliminar usuario:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteUser, isLoading, error };
}