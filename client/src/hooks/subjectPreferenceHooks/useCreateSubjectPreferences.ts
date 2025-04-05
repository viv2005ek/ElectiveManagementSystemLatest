import { useState } from "react";
import { T } from "../../pages/SubjectPages/SubjectPreferencesFillingPage.tsx";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import axiosInstance from "../../axiosInstance.ts";

interface UseCreateSubjectPreferencesResult {
  fillPreferences: (subjectId: string, preferences: T[]) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useCreateSubjectPreferences =
  (): UseCreateSubjectPreferencesResult => {
    const { notify } = useNotification();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const fillPreferences = async (
      subjectId: string,
      preferences: T[],
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = axiosInstance.post(
          `/subject-preferences/${subjectId}`,
          {
            preferences: preferences.map((preference) => preference.id),
          },
        );
        notify("promise", "Submitting preferences...", response);

        if ((await response).status !== 200) {
          throw new Error(
            (await response).data.error || "Failed to save preferences",
          );
        }

        setSuccess(true);
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

    return { fillPreferences, loading, error, success };
  };
