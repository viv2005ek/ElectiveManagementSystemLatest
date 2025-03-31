import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { Batch } from "../batchHooks/useFetchBatches.ts";

export interface Subject {
  id: string;
  name: string;
  totalStudents: number;
  preferencesFilled: number;
  remainingStudents: number;
  batch: Batch;
  isPreferenceWindowOpen: boolean;
  isAllotmentFinalized: boolean;
  // Add other fields as needed
}

interface UseSubjectsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  batchId?: string;
  semesterId?: string;
  subjectTypeId?: string;
  isPreferenceWindowOpen?: boolean;
  isAllotmentFinalized?: boolean;
  programIds?: string[];
}

interface UseSubjectsResult {
  subjects: Subject[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const useFetchSubjects = ({
  page = 1,
  pageSize = 10,
  search = "",
  batchId,
  semesterId,
  subjectTypeId,
  isPreferenceWindowOpen,
  isAllotmentFinalized,
  programIds,
}: UseSubjectsParams): UseSubjectsResult => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/subjects", {
        params: {
          page,
          pageSize,
          search,
          batchId,
          semesterId,
          subjectTypeId,
          isPreferenceWindowOpen,
          isAllotmentFinalized,
          programIds: programIds?.join(","),
        },
      });

      setSubjects(response.data.subjects);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    search,
    batchId,
    semesterId,
    subjectTypeId,
    isPreferenceWindowOpen,
    isAllotmentFinalized,
    programIds,
  ]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    totalPages,
    currentPage,
    loading,
    error,
    refresh: fetchSubjects,
  };
};

export default useFetchSubjects;
