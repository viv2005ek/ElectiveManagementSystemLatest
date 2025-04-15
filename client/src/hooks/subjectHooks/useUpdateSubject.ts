import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { useNotification } from "../../contexts/NotificationContext.tsx";

interface UpdateSubjectDetails {
  name?: string;
  batchId?: string;
  subjectTypeId?: string;
  semesterId?: string;
  departmentId?: string;
  schoolId?: string;
  facultyId?: string;
  programIds?: string[];
  coursesWithSeats?: { id: string; seats: number }[];
}

export default function useUpdateSubject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  const updateSubject = async (
    subjectId: string,
    details: {
      name: string;
      batchId: string | undefined;
      subjectTypeId: string | undefined;
      semesterId: string | undefined;
      departmentId: string | undefined;
      schoolId: string | undefined;
      facultyId: string | undefined;
      programIds: string[];
      coursesWithSeats: { id: string; seats: number | null }[];
    },
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = axiosInstance.put(`/subjects/${subjectId}`, details);
      notify("promise", "Updating Subject...", response); // notify works with the promise
      setLoading(false);
      return (await response).status === 200;
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
      setLoading(false);
      return false;
    }
  };

  return { updateSubject, loading, error };
}
