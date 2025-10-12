import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface StudentData {
  firstName: string;
  lastName: string;
  gender: string;
  contactNumber: string;
  registrationNumber: string;
  semester: number;
  batchId: string;
  email: string;
  programId: string;
  password: string;
}

interface BulkAddData {
  students: StudentData[];
}

export default function useBulkAddStudents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkAddStudents = async (data: BulkAddData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.post("/students/bulk-add", data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to bulk add students");
      setLoading(false);
      throw err;
    }
  };

  return { bulkAddStudents, loading, error };
}