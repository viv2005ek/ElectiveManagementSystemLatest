import { useState, useEffect } from "react";
import axios from "axios";

export interface CourseBucket {
  id: string;
  name: string;
  departmentId: string;
  department: {
    id: string;
    name: string;
    schoolId: string;
    school: {
      id: string;
      name: string;
      facultyId: string;
      faculty: {
        id: string;
        name: string;
      };
    };
  };
  courses: { id: string; name: string }[];
  subjectTypes: { id: string; name: string }[];
}

interface UseCourseBucketsParams {
  departmentId?: string;
  schoolId?: string;
  facultyId?: string;
  subjectTypeId?: string;
}

const useCourseBuckets = (params?: UseCourseBucketsParams) => {
  const [courseBuckets, setCourseBuckets] = useState<CourseBucket[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseBuckets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<CourseBucket[]>("/course-buckets", {
          params,
        });
        setCourseBuckets(response.data);
      } catch (err) {
        console.error("Error fetching course buckets:", err);
        setError("Failed to fetch course buckets.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseBuckets();
  }, [JSON.stringify(params)]); // Re-fetch when params change

  return { courseBuckets, loading, error };
};

export default useCourseBuckets;
