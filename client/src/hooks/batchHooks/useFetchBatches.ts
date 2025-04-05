import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

export interface Batch {
  id: string;
  year: number;
}

const useFetchBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/batches");

        setBatches(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch batches");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return { batches, loading, error };
};

export default useFetchBatches;
