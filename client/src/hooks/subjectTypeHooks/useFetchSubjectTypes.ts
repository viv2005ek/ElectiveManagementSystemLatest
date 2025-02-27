import { useState, useEffect } from "react";
import axios from "axios";
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

const useFetchSubjectTypes = () => {
  const [subjectTypes, setSubjectTypes] = useState<SubjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjectTypes = async () => {
      try {
        const response = await axiosInstance.get("/subject-types");
        setSubjectTypes(response.data);
      } catch (err) {
        setError("Failed to fetch subject types");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectTypes();
  }, []);

  return { subjectTypes, loading, error };
};

export default useFetchSubjectTypes;
