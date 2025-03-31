import {useState} from "react";
import axiosInstance from "../../axiosInstance.ts";
import axios from "axios";
import {useNotification} from "../../contexts/NotificationContext.tsx";

interface SubjectData {
  name: string;
  batchId: string;
  subjectTypeId: string;
  programType?: string;
  departmentId?: string | null;
  facultyId?: string | null;
  schoolId?: string | null;
  programIds: string[];
  subjectScope: string;
  semesterId: string | null;
  semesterIds: string[];
  coursesWithSeats?: { courseId: string; seats: number }[];
  courseBucketsWithSeats?: { bucketId: string; seats: number }[];
  numberOfCoursesInABucket?: number | null;
}

const useCreateSubject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SubjectData | null>(null);

  const { notify } = useNotification();

  const createSubject = async (subjectData: SubjectData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...subjectData,
        numberOfCoursesInABucket: subjectData.numberOfCoursesInABucket ?? null,
        semesterIds: subjectData.semesterIds?.length
          ? subjectData.semesterIds
          : [],
        coursesWithSeats:
          subjectData.coursesWithSeats?.map(({ courseId, seats }) => ({
            id: courseId,
            seats,
          })) || [],
        courseBucketsWithSeats:
          subjectData.courseBucketsWithSeats?.map(({ bucketId, seats }) => ({
            id: bucketId,
            seats,
          })) || [],
      };

      const response = axiosInstance.post("/subjects", payload);
      notify("promise", "Creating new subject", response);
      setData((await response).data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to create subject");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { createSubject, loading, error, data };
};

export default useCreateSubject;
