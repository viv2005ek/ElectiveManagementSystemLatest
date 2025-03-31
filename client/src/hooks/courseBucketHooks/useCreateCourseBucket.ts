import {useState} from "react";
import axiosInstance from "../../axiosInstance.ts";
import {useNotification} from "../../contexts/NotificationContext.tsx";

export interface CourseBucketPayload {
  name: string;
  departmentId?: string;
  numberOfCourses?: number;
  subjectTypeIds?: string[];
  courses: { id: string; orderIndex: number }[];
}

export default function useCreateCourseBucket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  const addCourseBucket = async (payload: CourseBucketPayload) => {
    setLoading(true);
    setError(null);

    try {
      const promise = axiosInstance.post("/course-buckets", payload);
      notify(
        "promise",
        "Creating Course Bucket...",
        promise,
        "Failed to create course bucket",
      );

      const response = await promise;
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addCourseBucket, loading, error };
}
