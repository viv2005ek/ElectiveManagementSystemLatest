import {useEffect, useState} from "react";
import axiosInstance from "../../axiosInstance.ts";

const useFetchCourse = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/courses/${id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return { data, loading, error };
};

export default useFetchCourse;
