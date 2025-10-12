import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

export default function useDeleteProfessor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProfessor = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await axiosInstance.delete(`/professors/${id}`);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete professor");
      setLoading(false);
      throw err;
    }
  };

  return { deleteProfessor, loading, error };
}