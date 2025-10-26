import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface Student {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  contactNumber: string | null;
  gender: string;
  semester: number;
  programId: string;
  batchId: string;
  registrationNumber: string;
  isDeleted: boolean;
  program: {
    id: string;
    name: string;
    department: {
      id: string;
      name: string;
      school: {
        id: string;
        name: string;
      };
    };
  };
  batch: {
    id: string;
    year: string;
  };
}

const useFetchStudentById = (id: string) => {
  const [data, setData] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) {
        setError("Student ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/students/${id}`);
        setData(response.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch student";
        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/students/${id}`);
      setData(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch student";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export default useFetchStudentById;