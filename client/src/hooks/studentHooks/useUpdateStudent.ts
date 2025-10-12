import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface UpdateStudentData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  gender: string;
  semester: number;
  programId: string;
  batchId: string;
}

export default function useUpdateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStudent = async (id: string, data: UpdateStudentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.put(`/students/${id}`, data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update student");
      setLoading(false);
      throw err;
    }
  };

  return { updateStudent, loading, error };
}