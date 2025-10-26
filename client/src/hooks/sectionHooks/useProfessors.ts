import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

export interface Professor {
  id: string;
  firstName: string;
  middleName: string | "";
  lastName: string;
  email: string;
  registrationNumber: string;
  departmentId: string;
  professorRankId: string;
  department: {
    name: string;
    school: {
      name: string;
    };
  };
  professorRank: {
  id: number;
  name: string;
  priority: number; // Add this line
};
}

interface UseProfessorsReturn {
  data: Professor[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useProfessors = (search?: string): UseProfessorsReturn => {
  const [data, setData] = useState<Professor[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfessors = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<Professor[]>(
        "/elective-sections/professors",
        {
          params: { search },
        },
      );
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, [search]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProfessors,
  };
};

export default useProfessors;
