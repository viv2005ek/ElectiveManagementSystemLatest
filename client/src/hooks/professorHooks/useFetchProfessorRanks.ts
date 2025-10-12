import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface ProfessorRank {
  id: string;
  name: string;
}

const useFetchProfessorRanks = () => {
  const [professorRanks, setProfessorRanks] = useState<ProfessorRank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessorRanks = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get("/professor-ranks");
        setProfessorRanks(data.professorRanks || data);
      } catch (err) {
        setError("Failed to fetch professor ranks");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorRanks();
  }, []);

  return { professorRanks, loading, error };
};

export default useFetchProfessorRanks;