import {useState} from "react";
import axiosInstance from "../../axiosInstance.ts";
import {useNotification} from "../../contexts/NotificationContext.tsx";

interface SubjectTypeData {
  name: string;
  description?: string;
  allotmentType: string;
  scope: string;
}

const useCreateSubjectType = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { notify } = useNotification();

  const createSubjectType = async (subjectTypeData: SubjectTypeData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const responsePromise = axiosInstance.post(
        "/subject-types",
        subjectTypeData,
      );

      // Use toast.promise to show loading and success/failure states
      notify(
        "promise",
        "Creating subject type...",
        responsePromise,
        "Failed to create subject type",
      );

      const response = await responsePromise;

      setSuccess(true);
      return response.data;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Failed to create subject type";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { createSubjectType, loading, error, success };
};

export default useCreateSubjectType;
