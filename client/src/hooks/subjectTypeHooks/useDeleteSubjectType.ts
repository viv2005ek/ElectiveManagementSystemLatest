import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { useNotification } from "../../contexts/NotificationContext.tsx";

interface UseDeleteSubjectTypeResult {
  deleteSubjectType: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useDeleteSubjectType = (): UseDeleteSubjectTypeResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  const deleteSubjectType = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = axiosInstance.delete(`/subject-types/${id}`);
      notify("promise", "Deleting subject type...", response);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { deleteSubjectType, loading, error };
}; 