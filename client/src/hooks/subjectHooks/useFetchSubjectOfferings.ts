import { useEffect, useState } from "react";
import { Semester } from "../semesterHooks/useFetchSemesters.ts";
import axiosInstance from "../../axiosInstance.ts";

interface SubjectType {
  id: string;
  name: string;
  description: string;
  allotmentType: string;
  scope: string;
}

export interface CourseOffering {
  id: string;
  name: string;
  code: string;
  totalSeats?: number;
  availableSeats?: number;
  credits: number;
  departmentId: string;
}

export interface CourseBucketOffering {
  id: string;
  name: string;
  totalSeats?: number;
  availableSeats?: number;
  courses: CourseOffering[];
}

interface Offerings {
  subjectName: string;
  subjectType: SubjectType;
  batchName: number;
  semesters: Semester[];
  semester: Semester | null;
  courses: CourseOffering[];
  courseBuckets: CourseBucketOffering[];
  totalPages: number;
}

const useFetchSubjectOfferings = (
  subjectId: string | undefined,
  currentPage?: number,
  search?: string,
) => {
  const [offerings, setOfferings] = useState<Offerings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOfferings = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/subjects/${subjectId}/offerings`,
          {
            params: { page: currentPage ?? null, search: search ?? null },
          },
        );
        setOfferings(response.data);
      } catch (error) {
        console.error("Error fetching subject offerings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchOfferings();
    }
  }, [subjectId, currentPage, search]);

  return { offerings, loading };
};

export default useFetchSubjectOfferings;
