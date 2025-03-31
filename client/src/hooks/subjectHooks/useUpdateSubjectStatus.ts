import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { AxiosError } from "axios";
import { useNotification } from "../../contexts/NotificationContext.tsx";

interface UpdateSubjectStatusParams {
  id: string;
  isPreferenceWindowOpen: boolean;
  isAllotmentFinalized: boolean;
}

interface UseUpdateSubjectStatusResult {
  updateSubjectStatus: (params: UpdateSubjectStatusParams) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

interface ErrorResponse {
  error: string;
}

export const useUpdateSubjectStatus = (): UseUpdateSubjectStatusResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { notify } = useNotification();

  const updateSubjectStatus = async ({
    id,
    isPreferenceWindowOpen,
    isAllotmentFinalized,
  }: UpdateSubjectStatusParams): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = axiosInstance.patch(`/subjects/${id}/status`, {
        isPreferenceWindowOpen,
        isAllotmentFinalized,
      });
      notify("promise", "Updating Subject status ...", response);
      await response;
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.error || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateSubjectStatus, loading, error };
};
