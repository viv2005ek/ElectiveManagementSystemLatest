import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

export interface Course {
  id: string;
  code: string;
  name: string;
}

export interface CourseBucket {
  id: string;
  name: string;
  totalCredits: number;
  numberOfCourses: number;
  department: { id: string; name: string };
  subjectTypes: { name: string }[];
  courses: { course: Course; orderIndex: number }[];
}

interface UseCourseBucketsProps {
  departmentIds?: string[];
  departmentId?: string;
  schoolIds?: string[];
  schoolId?: string;
  facultyIds?: string[];
  facultyId?: string;
  programIds?: string[];
  programId?: string;
  subjectTypeIds?: string[];
  subjectTypeId?: string;
  subjectId?: string;
  totalCredits?: number;
  numberOfCourses?: number | null;
  name?: string;
  page?: number;
}

const useCourseBuckets = (filters: UseCourseBucketsProps) => {
  const [data, setData] = useState<CourseBucket[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(filters.page || 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuckets = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          ...filters,
          departmentIds: filters.departmentIds?.join(","),
          schoolIds: filters.schoolIds?.join(","),
          facultyIds: filters.facultyIds?.join(","),
          programIds: filters.programIds?.join(","),
          subjectTypeIds: filters.subjectTypeIds?.join(","),
          page: currentPage,
        };

        if (filters.subjectId) {
          params.subjectId = filters.subjectId;
        }

        const response = await axiosInstance.get("/course-buckets", { params });

        setData(response.data.courseBuckets);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch course buckets");
      } finally {
        setLoading(false);
      }
    };

    fetchBuckets();
  }, [JSON.stringify(filters), currentPage]);

  return { data, totalPages, currentPage, setCurrentPage, loading, error };
};

export default useCourseBuckets;
