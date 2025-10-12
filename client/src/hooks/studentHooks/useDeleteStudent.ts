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
      setError(err.response?.data?.message || "Failed to delete student");
      setLoading(false);
      throw err;
    }
  };

  return { deleteStudent, loading, error };
}