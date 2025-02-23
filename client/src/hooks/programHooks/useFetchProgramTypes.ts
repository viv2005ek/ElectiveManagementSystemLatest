import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance.ts';

const useFetchProgramTypes = () => {
  const [programTypes, setProgramTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramTypes = async () => {
      try {
        const response = await axiosInstance.get("/enums/program-types");
        setProgramTypes(response.data);
      } catch (err) {
        setError("Failed to fetch program types");
      } finally {
        setLoading(false);
      }
    };

    fetchProgramTypes();
  }, []);

  return { programTypes, loading, error };
};

export default useFetchProgramTypes;
