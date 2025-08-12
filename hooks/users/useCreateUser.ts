"use client";
import api from "@/lib/axios.config";
import { CreateUserDto, User } from "@/entities/User";
import { useState } from "react";

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = async (userData: CreateUserDto): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.post("/users", userData);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error("Error al crear usuario:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
}