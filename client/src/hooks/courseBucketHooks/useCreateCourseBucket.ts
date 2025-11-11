import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { useNotification } from "../../contexts/NotificationContext.tsx";

// useCreateCourseBucket.ts
export interface CourseBucketPayload {
  name: string;
  departmentId: string;
  numberOfCourses: number;
  totalCredits: number; // Add this
  subjectTypeIds?: string[];
  courses: { id: string; orderIndex: number }[];
}
export default function useCreateCourseBucket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

// useCreateCourseBucket.ts
const addCourseBucket = async (payload: CourseBucketPayload) => {
  setLoading(true);
  setError(null);

  try {
    // console.log("Sending payload to server:", JSON.stringify(payload, null, 2));
    
    const promise = axiosInstance.post("/course-buckets", payload);
    notify(
      "promise",
      "Creating Course Bucket...",
      promise,
      "Failed to create course bucket",
    );

    const response = await promise;
    // console.log("Server response:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("Error details:", err.response?.data);
    setError(err.response?.data?.message || "Something went wrong");
    return null;
  } finally {
    setLoading(false);
  }
};

  return { addCourseBucket, loading, error };
}
