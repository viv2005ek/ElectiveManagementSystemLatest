import { useEffect, useState } from "react";
import axios from "axios";

export const useStudentAllotments = () => {
  const [allotments, setAllotments] = useState<{
    standaloneAllotments: any[];
    bucketAllotments: any[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllotments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("/allotments/me");
        setAllotments(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch allotments");
      } finally {
        setLoading(false);
      }
    };

    fetchAllotments();
  }, []);

  return { allotments, loading, error };
};
