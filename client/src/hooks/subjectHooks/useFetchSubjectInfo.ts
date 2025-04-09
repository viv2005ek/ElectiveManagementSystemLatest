import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { AllotmentType } from "../subjectTypeHooks/useFetchSubjectTypes.ts";

type SubjectInfoResponse = {
  name: string;
  semester: {
    id: string;
    number: number;
  } | null;
  batch: {
    id: string;
    year: number;
  };
  dueDate: string;
  subjectType: {
    id: string;
    name: string;
    allotmentType: AllotmentType;
  };
  semesters: {
    id: string;
    number: number;
  }[];
  programs: {
    id: string;
    name: string;
  }[];
  coursesWithSeats: {
    course: {
      id: string;
      name: string;
      code: string;
    };
    totalSeats: number | null;
  }[];
  courseBucketsWithSeats: {
    courseBucket: {
      id: string;
      name: string;
    };
    totalSeats: number | null;
  }[];
};

export default function useFetchSubjectInfo(id?: string) {
  const [data, setData] = useState<SubjectInfoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjectInfo = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/subjects/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching subject info:", err);
      setError("Failed to fetch subject info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectInfo();
  }, [id]);

  return {
    data,
    loading,
    error,
    fetchSubjectInfo,
  };
}
