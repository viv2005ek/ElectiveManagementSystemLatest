import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface AllotmentStats {
  courses: Array<{
    id: string;
    name: string;
    code: string;
    studentCount: number;
  }>;
  courseBuckets: Array<{
    id: string;
    name: string;
    studentCount: number;
  }>;
  unallottedStudents: number;
}

const useAllotmentStats = (subjectId?: string) => {
  const [data, setData] = useState<AllotmentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    const fetchAllotmentStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get<AllotmentStats>(
          `/subjects/${subjectId}/allotments/stats`,
        );
        setData(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllotmentStats();
  }, [subjectId]);

  return { data, loading, error };
};

export default useAllotmentStats;
