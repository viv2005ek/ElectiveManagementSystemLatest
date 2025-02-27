import { useEffect, useState } from "react";
import axios from "axios";

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
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/batches`,
          {
            withCredentials: true,
          },
        );

        setBatches(response.data.batches);
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
