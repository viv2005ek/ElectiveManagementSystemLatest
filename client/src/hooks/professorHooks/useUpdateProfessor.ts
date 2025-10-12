import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface UpdateProfessorData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  departmentId: string;
  professorRankId: string;
}

export default function useUpdateProfessor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfessor = async (id: string, data: UpdateProfessorData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.put(`/professors/${id}`, data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update professor");
      setLoading(false);
      throw err;
    }
  };

  return { updateProfessor, loading, error };
}