import { useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';

export const useRunAllotment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAllotment = async (subjectId: string) => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post(`/subject-preferences/${subjectId}/run-allotment`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run allotment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { runAllotment, loading, error };
}; 