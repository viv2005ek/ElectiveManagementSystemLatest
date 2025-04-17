import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface ElectiveStudent {
  id: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  registrationNumber: string;
  semester: number;
  program: {
    name: string;
    department: {
      name: string;
    };
  };
  batch: {
    year: number;
  };
  electiveSections: {
    name: string;
  }[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

interface SubjectCourseStudentsResponse {
  students: ElectiveStudent[];
  pagination: PaginationData;
}

interface UseSubjectCourseStudentsReturn {
  data: SubjectCourseStudentsResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useSubjectCourseStudents = (
  subjectCourseWithSeatsId: string | undefined,
  sectionId?: string,
  search?: string,
  page: number = 1,
  limit: number = 10,
): UseSubjectCourseStudentsReturn => {
  const [data, setData] = useState<SubjectCourseStudentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudents = async () => {
    if (!subjectCourseWithSeatsId) {
      setError(new Error("Subject course ID is required"));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        ...(sectionId && { sectionId }),
        ...(search && { search }),
        page: page.toString(),
        limit: limit.toString(),
      });

      const { data } = await axiosInstance.get(
        `/subjects/courses/${subjectCourseWithSeatsId}/students?${params}`,
      );
      setData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch students"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [subjectCourseWithSeatsId, sectionId, search, page, limit]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStudents,
  };
};

export type { ElectiveStudent, PaginationData, SubjectCourseStudentsResponse };
export default useSubjectCourseStudents;
