import {useEffect, useState} from "react";
import axiosInstance from "../../axiosInstance.ts";

export interface Semester {
  id: string;
  number: number;
}

const useFetchSemesters = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/semesters");

        setSemesters(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch semesters");
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  return { semesters, loading, error };
};

export default useFetchSemesters;
