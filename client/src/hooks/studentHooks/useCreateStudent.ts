import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface CreateStudentData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  contactNumber: string;
  gender: string;
  semester: string;
  programId: string;
  batchId: string;
  password: string;
}

export default function useCreateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = async (data: CreateStudentData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert single student to bulk format
      const bulkData = {
        students: [{
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          contactNumber: data.contactNumber,
          registrationNumber: data.registrationNumber,
          semester: parseInt(data.semester),
          batchId: data.batchId,
          email: data.email,
          programId: data.programId,
          password: data.password
        }]
      };
      
      const response = await axiosInstance.post("/students/bulk-add", bulkData);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create student");
      setLoading(false);
      throw err;
    }
  };

  return { createStudent, loading, error };
}