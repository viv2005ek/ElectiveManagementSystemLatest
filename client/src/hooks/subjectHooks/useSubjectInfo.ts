import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  semester: number;
  year: number;
  maxStudents: number;
  currentStudents: number;
}

export const useSubjectInfo = (id: string) => {
  const [data, setData] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjectInfo = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/subjects/${id}`);
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch subject info",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectInfo();
  }, [id]);

  return { data, loading, error };
};