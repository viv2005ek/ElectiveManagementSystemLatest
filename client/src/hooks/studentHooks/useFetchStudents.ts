import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/students`;

export interface Student {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  registrationNumber: string;
  email: string;
  semester: number;
  gender: string;
  contactNumber: string;
  program: {
    id: string;
    name: string;
    department: {
      id: string;
      name: string;
      school: {
        id: string;
        name: string;
      };
    };
  };
  batch: {
    id: string;
    year: number;
  };
}

export interface FetchStudentsParams {
  programId?: string;
  batchId?: string;
  semesterId?: string;
  departmentId?: string;
  schoolId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const useFetchStudents = (params: FetchStudentsParams) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            query.append(key, value.toString());
          }
        });

        const { data } = await axiosInstance.get(
          `/students?${query.toString()}`,
        );

        setStudents(data.students);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setPageSize(data.pageSize);
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [JSON.stringify(params)]);

  return { students, totalPages, currentPage, pageSize, loading, error };
};
