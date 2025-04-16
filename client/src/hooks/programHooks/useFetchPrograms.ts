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
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        
        if (options?.departmentId) params.append('departmentId', options.departmentId);
        if (options?.schoolId) params.append('schoolId', options.schoolId);
        if (options?.facultyId) params.append('facultyId', options.facultyId);
        if (options?.programType) params.append('programType', options.programType);
        if (options?.search) params.append('search', options.search);
        
        params.append('page', String(currentPage));
        params.append('limit', String(options?.limit || 10));

        const response = await axiosInstance.get(`/programs?${params.toString()}`);
        
        if (!response.data) {
          throw new Error('No data received from server');
        }

        const programsData = response.data.programs;
        if (!Array.isArray(programsData)) {
          throw new Error('Invalid programs data received');
        }

        setPrograms(programsData);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch programs');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [
    options?.departmentId,
    options?.schoolId,
    options?.facultyId,
    options?.programType,
    options?.search,
    options?.limit,
    currentPage
  ]);

  return { programs, totalPages, currentPage, setCurrentPage, loading, error };
}
