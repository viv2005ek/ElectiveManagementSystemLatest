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
        // console.log("Fetching course bucket with ID:", id);
        const response = await axiosInstance.get(`/course-buckets/${id}`);
        // console.log("Full API response:", response.data);
        // console.log("Courses in response:", response.data.courses);
        
        // Check if courses exist and have course data
        if (response.data.courses) {
          response.data.courses.forEach((item: any, index: number) => {
            // console.log(`Course item ${index}:`, item);
            // console.log(`Course data at ${index}:`, item.course);
          });
        }
        
        setData(response.data);
      } catch (err: any) {
        console.error("Error fetching course bucket:", err);
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