import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

interface PreferenceOption {
  id: string;
  name: string;
}

const useStudentsSubjectPreferences = (subjectId: string | undefined) => {
  const [preferences, setPreferences] = useState<PreferenceOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<PreferenceOption[]>(
        `/subject-preferences/${subjectId}/me`,
      );
      setPreferences(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch preferences");
      setPreferences([]);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    if (subjectId) {
      fetchPreferences();
    }
  }, [subjectId, fetchPreferences]);

  const updatePreferences = async (newPreferences: string[]) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/subject-preferences/${subjectId}`, {
        preferences: newPreferences,
      });
      await fetchPreferences();
      return true;
    } catch (err) {
      setError("Failed to update preferences");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences,
  };
};

export default useStudentsSubjectPreferences;
