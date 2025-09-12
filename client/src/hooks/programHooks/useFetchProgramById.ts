import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { Program } from "./useFetchPrograms.ts";

const useFetchProgramById = (id: string) => {
  const [data, setData] = useState<Program | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/programs/${id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch program");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  return { data, loading, error };
};

export default useFetchProgramById;