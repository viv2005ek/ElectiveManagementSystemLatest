import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

type Course = {
  id: string;
  name: string;
};

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  preferences: {
    firstPreferenceCourse?: Course | null;
    secondPreferenceCourse?: Course | null;
    thirdPreferenceCourse?: Course | null;
    firstPreferenceCourseBucket?: Course | null;
    secondPreferenceCourseBucket?: Course | null;
    thirdPreferenceCourseBucket?: Course | null;
    createdAt: string | null;
  } | null;
};

export type SubjectPreferenceResponse = {
  students: Student[];
  totalStudents: number;
  filledPreferencesCount: number;
  pendingStudentsCount: number;
  totalPages: number;
  currentPage: number;
};

export default function useSubjectPreferences(
  id?: string,
  page: number = 1,
  preferenceStatus?: string | undefined,
  search?: string,
) {
  const [data, setData] = useState<SubjectPreferenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/subject-preferences/${id}`, {
        params: { page, preferenceStatus, search },
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching preferences:", err);
      setError("Failed to fetch preferences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [id, page, preferenceStatus, search]);

  return {
    data,
    loading,
    error,
    fetchPreferences,
  };
}
