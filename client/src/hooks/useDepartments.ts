"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance.ts";

export interface Department {
  id: string;
  name: string;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/departments");
        const data: Department[] = await response.data;
        setDepartments(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, isLoading, error };
}
