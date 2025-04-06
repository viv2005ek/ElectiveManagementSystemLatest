import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface RunAllotmentParams {
  subjectId: string;
}

interface UseRunAllotmentOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const useRunAllotment = ({ onSuccess, onError }: UseRunAllotmentOptions = {}) => {
  const [loading, setLoading] = useState(false);

  const runAllotment = async ({ subjectId }: RunAllotmentParams) => {
    setLoading(true);
    try {
      await axiosInstance.post(`/subjects/${subjectId}/allotments`);
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      if (onError) onError(message);
    } finally {
      setLoading(false);
    }
  };

  return { runAllotment, loading };
};

export default useRunAllotment;
