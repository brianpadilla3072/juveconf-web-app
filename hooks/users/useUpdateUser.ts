"use client";
import api from "@/lib/axios.config";
import { UpdateUserDto, User } from "@/entities/User";
import { useState } from "react";

export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUser = async (userId: string, userData: UpdateUserDto): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.put(`/users/${userId}`, userData);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al actualizar usuario:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, error };
}