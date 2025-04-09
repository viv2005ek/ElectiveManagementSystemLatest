import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { AllotmentType } from "../subjectTypeHooks/useFetchSubjectTypes.ts";

interface SubjectType {
  allotmentType: AllotmentType;
}

export interface StandaloneSubjectPreference {
  firstPreferenceCourse: { name: string };
  secondPreferenceCourse: { name: string };
  thirdPreferenceCourse: { name: string };
}

export interface BucketSubjectPreference {
  student: {
    firstName: string;
    lastName: string;
  };
  firstPreferenceCourseBucket: { name: string };
  secondPreferenceCourseBucket: { name: string };
  thirdPreferenceCourseBucket: { name: string };
}

interface SubjectPreferences {
  name: string;
  subjectType: SubjectType;
  batch: unknown; // Replace with the correct type if known
  standaloneSubjectPreferences: StandaloneSubjectPreference[];
  bucketSubjectPreferences: BucketSubjectPreference[];
}

const useSubjectPreferences = (
  subjectId: string | undefined,
  page: number = 1,
  size: number = 10,
) => {
  const [subjectPreferences, setSubjectPreferences] =
    useState<SubjectPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) {
      return;
    }
    const fetchSubjectPreferences = async () => {
      try {
        const response = await axiosInstance.get(
          `/subject-preferences/${subjectId}?page=${page}&size=${size}`,
        );
        setSubjectPreferences(response.data);
      } catch {
        setError("Error fetching subject preferences");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectPreferences();
  }, [subjectId, page, size]);

  return { subjectPreferences, loading, error };
};

export default useSubjectPreferences;
