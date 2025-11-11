import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface ProfessorRank {
  id: string;
  name: string;
  priority: number; // Add this field since it's in your schema
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
        const response = await axiosInstance.get("/professor-ranks");
        
        // Check the actual response structure
        // console.log("Professor ranks API response:", response.data);
        
        // Handle different response structures
        if (response.data.data) {
          // If response has { success: true, data: [...] }
          setProfessorRanks(response.data.data);
        } else if (response.data.professorRanks) {
          // If response has { professorRanks: [...] }
          setProfessorRanks(response.data.professorRanks);
        } else if (Array.isArray(response.data)) {
          // If response is directly the array
          setProfessorRanks(response.data);
        } else {
          setProfessorRanks([]);
        }
      } catch (err: any) {
        console.error("Error fetching professor ranks:", err);
        setError(err.response?.data?.message || "Failed to fetch professor ranks");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorRanks();
  }, []);

  return { professorRanks, loading, error };
};

export default useFetchProfessorRanks;