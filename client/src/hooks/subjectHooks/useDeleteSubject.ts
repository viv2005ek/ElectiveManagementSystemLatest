import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { useNotification } from "../../contexts/NotificationContext.tsx";

interface UseDeleteSubjectResult {
  deleteSubject: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useDeleteSubject = (): UseDeleteSubjectResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  const deleteSubject = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = axiosInstance.delete(`/subjects/${id}`);
      notify("promise", "Deleting subject...", response);
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

  return { deleteSubject, loading, error };
};
