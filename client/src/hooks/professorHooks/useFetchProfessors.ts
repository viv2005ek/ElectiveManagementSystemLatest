import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { Professor } from "../sectionHooks/useProfessors.ts";

interface FetchProfessorsParams {
  departmentId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

const useFetchProfessors = (params: FetchProfessorsParams = {}) => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessors = async () => {
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
          `/professors?${query.toString()}`,
        );

        setProfessors(data.professors);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setPageSize(data.pageSize);
      } catch (err) {
        setError("Failed to fetch professors");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, [JSON.stringify(params)]);

  return { professors, totalPages, currentPage, pageSize, loading, error };
};

export default useFetchProfessors;