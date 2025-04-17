import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
}

export interface SubjectCourse {
  id: string;
  course: Course;
  totalSeats: number;
  availableSeats: number;
}

interface UseSubjectCoursesReturn {
  data: SubjectCourse[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useSubjectCourses = (
  subjectId: string | undefined,
): UseSubjectCoursesReturn => {
  const [data, setData] = useState<SubjectCourse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourses = async () => {
    if (!subjectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<SubjectCourse[]>(
        `/elective-sections/subject-courses/${subjectId}`,
      );
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [subjectId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCourses,
  };
};

export default useSubjectCourses;
