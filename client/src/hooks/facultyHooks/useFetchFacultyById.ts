import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { Faculty } from "./useFetchFaculties.ts";

const useFetchFacultyById = (id: string) => {
  const [data, setData] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/faculties/${id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch faculty");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [id]);

  return { data, loading, error };
};

export default useFetchFacultyById;