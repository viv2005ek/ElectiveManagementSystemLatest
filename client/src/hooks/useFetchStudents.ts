import { useEffect, useState } from "react";
import { Branch } from "./useBranches.ts";
import axiosInstance from "../axiosInstance.ts";

export interface Student {
  id: string;
  registrationNumber: string;
  email: string;
  firstName: string;
  lastName?: string;
  gender: string;
  semester: number;
  batch: number;
  branch: {
    id: string;
    name: string;
    department: {
      id: string;
      name: string;
    };
  };
}

export const useFetchStudents = (
  // department: Department | null,
  branch: Branch | null,
  batch: number | null,
  semester: number | null,
  searchQuery: string,
  page?: number,
) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSizeReceived, setPageSizeReceived] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        // if (department) query.append("departmentId", department.id);
        if (semester) query.append("semester", semester.toString());
        if (page) query.append("page", page.toString());
        if (branch) query.append("branchId", branch.id);
        query.append("pageSize", "20");
        if (batch) query.append("batch", batch.toString());
        if (searchQuery) query.append("search", searchQuery);

        const response = await axiosInstance.get(
          `/students?${query.toString()}`,
        );
        setStudents(response.data.students);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batch, branch, semester, searchQuery, page]);

  return { students, loading, error, totalPages, page };
};
