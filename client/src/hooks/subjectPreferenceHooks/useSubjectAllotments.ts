import { AllotmentType } from "../subjectTypeHooks/useFetchSubjectTypes.ts";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

type AllotmentStudent = {
  registrationNumber: number;
  firstName: string;
  lastName: string;
};

type CourseAllotment = {
  name: string;
};

type StandaloneAllotment = {
  student: AllotmentStudent;
  course: CourseAllotment;
};

type BucketAllotment = {
  student: AllotmentStudent;
  courseBucket: {
    name: string;
  };
};

type SubjectAllotmentsResponse = {
  name: string;
  subjectType: {
    name: string;
    allotmentType: AllotmentType;
  };
  batch: {
    id: string;
    year: number;
  };
  standaloneAllotments: StandaloneAllotment[];
  bucketAllotments: BucketAllotment[];
  totalPages: number;
  currentPage: number;
};

type UseSubjectAllotmentsReturn = {
  data: SubjectAllotmentsResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const useSubjectAllotments = (
  subjectId: string | undefined,
  search?: string,
): UseSubjectAllotmentsReturn => {
  const [data, setData] = useState<SubjectAllotmentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllotments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/subjects/${subjectId}/allotments`,
        {
          params: { search }, // Add search query parameter
        },
      );
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch allotments"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [subjectId, search]); // Include search in dependencies

  useEffect(() => {
    if (!subjectId) return;
    fetchAllotments();
  }, [fetchAllotments, search]);

  return { data, isLoading, error, refetch: fetchAllotments };
};

export default useSubjectAllotments;
