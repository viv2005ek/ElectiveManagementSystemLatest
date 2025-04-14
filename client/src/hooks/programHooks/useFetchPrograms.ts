import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

export interface Program {
  id: string;
  name: string;
  programType: ProgramType;
  department: {
    id: string;
    name: string;
  };
}

interface FetchProgramsOptions {
  departmentId?: string;
  schoolId?: string;
  facultyId?: string;
  programType?: ProgramType;
  search?: string;
  page?: number;
  limit?: number;
}

export enum ProgramType {
  UNDERGRADUATE = "Undergraduate",
  POSTGRADUATE = "Postgraduate",
  PHD = "PhD",
}

export function useFetchPrograms(options?: FetchProgramsOptions) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(options?.page || 1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          ...options,
          page: String(currentPage),
          limit: String(options?.limit || 10),
        });

        const response = await axiosInstance.get(
          `/programs?${params.toString()}`,
        );
        setPrograms(response.data.programs);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch programs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [JSON.stringify(options), currentPage]);

  return { programs, totalPages, currentPage, setCurrentPage, loading, error };
}
