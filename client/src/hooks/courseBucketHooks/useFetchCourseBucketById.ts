import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { CourseBucket } from "./useFetchCourseBuckets.ts";

const useFetchCourseBucketById = (id: string) => {
  const [data, setData] = useState<CourseBucket | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseBucket = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/course-buckets/${id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch course bucket");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseBucket();
  }, [id]);

  return { data, loading, error };
};

export default useFetchCourseBucketById;