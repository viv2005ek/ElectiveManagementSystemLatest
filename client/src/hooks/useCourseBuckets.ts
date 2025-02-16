import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance.ts";

export interface Course {
  id: string;
  courseCode: string;
  name: string;
  semester: number;
}

export interface CourseBucket {
  id: string;
  name: string;
  courses: Course[];
}

interface UseCourseBucketsReturn {
  courseBuckets: CourseBucket[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useCourseBuckets = (): UseCourseBucketsReturn => {
  const [courseBuckets, setCourseBuckets] = useState<CourseBucket[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseBuckets = async () => {
      try {
        const response = await axiosInstance.get("/course-buckets");
        setCourseBuckets(response.data);
      } catch (err) {
        setError("Error fetching Course Buckets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseBuckets();
  }, []);

  return { courseBuckets, isLoading, error };
};
