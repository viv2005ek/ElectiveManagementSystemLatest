import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { School } from "./useFetchSchools.ts";

const useFetchSchoolById = (id: string) => {
  const [data, setData] = useState<School | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/schools/${id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch school");
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [id]);

  return { data, loading, error };
};

export default useFetchSchoolById;