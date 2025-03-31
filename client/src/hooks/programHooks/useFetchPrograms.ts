import {useEffect, useState} from "react";
import axiosInstance from "../../axiosInstance.ts";

export interface Program {
  id: string;
  name: string;
  programType: ProgramType;
  department: {
    id: string;
    name: string;
    school: {
      id: string;
      name: string;
      faculty?: { id: string; name: string };
    };
  };
}

export enum ProgramType {
  UNDERGRADUATE = "Undergraduate",
  POSTGRADUATE = "Postgraduate",
  PHD = "PhD",
}

interface FetchProgramsOptions {
  departmentId?: string;
  schoolId?: string;
  facultyId?: string;
  programType?: string;
  search?: string;
}

export function useFetchPrograms(options?: FetchProgramsOptions) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(
          Object.entries(options || {}).reduce(
            (acc, [key, value]) => {
              if (value) acc[key] = value;
              return acc;
            },
            {} as Record<string, string>,
          ),
        );

        const response = await axiosInstance.get(
          `/programs?${params.toString()}`,
        );
        setPrograms(response.data);
      } catch (err) {
        setError("Failed to fetch programs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [JSON.stringify(options)]);

  return { programs, loading, error };
}
