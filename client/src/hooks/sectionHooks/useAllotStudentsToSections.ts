import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

const useAllotStudentsToSections = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allotStudentsToSections = async (subjectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/elective-sections/${subjectId}/allot`,
      );
      return response.data; // Return the response data if needed
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
      throw err; // Re-throw the error if the caller needs to handle it
    } finally {
      setLoading(false);
    }
  };

  return { allotStudentsToSections, loading, error };
};

export default useAllotStudentsToSections;
