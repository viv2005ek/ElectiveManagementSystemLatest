import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

export interface SubjectType {
  id: string;
  name: string;
  description: string;
  allotmentType: "STANDALONE" | "BUCKET";
  scope: string;
  createdAt: string;
  updatedAt: string;
}

interface UseSubjectTypesReturn {
  subjectTypes: SubjectType[];
  loading: boolean;
  error: Error | null;
  fetchSubjectTypes: () => Promise<void>;
  createSubjectType: (
    data: Omit<SubjectType, "id" | "createdAt" | "updatedAt">,
  ) => Promise<SubjectType>;
  updateSubjectType: (
    id: string,
    data: Partial<
      Omit<SubjectType, "id" | "createdAt" | "updatedAt" | "allotmentType">
    >,
  ) => Promise<SubjectType>;
  deleteSubjectType: (id: string) => Promise<void>;
}

export default function useSubjectTypes(): UseSubjectTypesReturn {
  const [subjectTypes, setSubjectTypes] = useState<SubjectType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubjectTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/subject-types");
      setSubjectTypes(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch subject types"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectTypes();
  }, []);

  const createSubjectType = async (
    data: Omit<SubjectType, "id" | "createdAt" | "updatedAt">,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/subject-types", data);
      setSubjectTypes((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create subject type"),
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubjectType = async (
    id: string,
    data: Partial<
      Omit<SubjectType, "id" | "createdAt" | "updatedAt" | "allotmentType">
    >,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/subject-types/${id}`, data);
      setSubjectTypes((prev) =>
        prev.map((type) => (type.id === id ? response.data : type)),
      );
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update subject type"),
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubjectType = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/subject-types/${id}`);
      setSubjectTypes((prev) => prev.filter((type) => type.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete subject type"),
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    subjectTypes,
    loading,
    error,
    fetchSubjectTypes,
    createSubjectType,
    updateSubjectType,
    deleteSubjectType,
  };
}
