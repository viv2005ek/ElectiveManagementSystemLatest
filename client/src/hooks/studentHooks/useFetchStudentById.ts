import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { Student } from "./useFetchStudents.ts";

const useFetchStudentById = (id: string) => {
  const [data, setData] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/students/${id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch student");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  return { data, loading, error };
};

export default useFetchStudentById;