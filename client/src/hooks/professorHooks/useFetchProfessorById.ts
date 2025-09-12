import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { Professor } from "../sectionHooks/useProfessors.ts";

const useFetchProfessorById = (id: string) => {
  const [data, setData] = useState<Professor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessor = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/professors/${id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch professor");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessor();
  }, [id]);

  return { data, loading, error };
};

export default useFetchProfessorById;