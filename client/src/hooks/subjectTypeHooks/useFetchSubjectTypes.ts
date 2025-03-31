import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance.ts";

export interface SubjectType {
  id: string;
  name: string;
  description?: string;
  allotmentType: AllotmentType;
  scope: string;
}

export enum SubjectScope {
  ANY_DEPARTMENT = "AnyDepartment",
  SAME_DEPARTMENT = "SameDepartment",
  SAME_SCHOOL = "SameSchool",
  SAME_FACULTY = "SameFaculty",
}

export enum AllotmentType {
  STANDALONE = "Standalone",
  BUCKET = "Bucket",
}

type UseFetchSubjectTypesProps = {
  allotmentType?: string;
};

const useFetchSubjectTypes = (options?: UseFetchSubjectTypesProps) => {
  const [subjectTypes, setSubjectTypes] = useState<SubjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjectTypes = async () => {
      try {
        const queryParam = options?.allotmentType
          ? `allotmentType=${encodeURIComponent(options.allotmentType)}`
          : "";
        const response = await axiosInstance.get(
          `/subject-types${queryParam ? `?${queryParam}` : ""}`,
        );
        setSubjectTypes(response.data);
      } catch (err) {
        setError("Failed to fetch subject types");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectTypes();
  }, [options?.allotmentType]); // Include allotmentType in dependencies to refetch when it changes

  return { subjectTypes, loading, error };
};

export default useFetchSubjectTypes;
