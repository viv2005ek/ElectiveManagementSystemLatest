import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { Department } from "./useFetchDepartments.ts";

const useFetchDepartmentById = (id: string) => {
  const [data, setData] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/departments/${id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch department");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  return { data, loading, error };
};

export default useFetchDepartmentById;