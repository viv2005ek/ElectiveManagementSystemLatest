import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

export default function useDeleteStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStudent = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await axiosInstance.delete(`/students/${id}`);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to delete student";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { deleteStudent, loading, error, clearError };
}