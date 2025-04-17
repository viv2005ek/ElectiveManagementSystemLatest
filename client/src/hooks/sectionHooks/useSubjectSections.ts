import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
}

export interface Section {
  id: string;
  name: string;
  professor: Professor;
  Course: Course;
  students: Student[];
  SubjectCourseWithSeats: {
    totalSeats: number;
    availableSeats: number;
  };
}

interface UseSubjectSectionsReturn {
  data: Section[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useSubjectSections = (
  subjectId: string | undefined,
): UseSubjectSectionsReturn => {
  const [data, setData] = useState<Section[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSections = async () => {
    if (!subjectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<Section[]>(
        `/elective-sections/subject/${subjectId}`,
      );
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [subjectId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSections,
  };
};

export default useSubjectSections;
