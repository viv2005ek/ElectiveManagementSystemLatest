import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import {
  AllotmentType,
  SubjectScope,
} from "../subjectTypeHooks/useFetchSubjectTypes.ts";
import { Department } from "../departmentHooks/useFetchDepartments.ts";
import { School } from "../schoolHooks/useFetchSchools.ts";
import { Faculty } from "../facultyHooks/useFetchFaculties.ts";
import { Program } from "../programHooks/useFetchPrograms.ts";
import { Course } from "../courseBucketHooks/useFetchCourseBuckets.ts";

type SubjectInfoResponse = {
  name: string;
  semester: {
    id: string;
    number: number;
  } | null;
  isPreferenceWindowOpen: boolean;
  isAllotmentFinalized: boolean;
  batch: {
    id: string;
    year: number;
  };
  dueDate: string;
  subjectType: {
    id: string;
    name: string;
    allotmentType: AllotmentType;
    scope: SubjectScope;
  };
  numberOfCoursesInBucket: number | null;
  department: Department | null;
  school: School | null;
  faculty: Faculty | null;
  semesters: {
    id: string;
    number: number;
  }[];
  programs: Program[];
  coursesWithSeats: CourseWithSeats[];
  courseBucketsWithSeats: CourseBucketWithSeats[];
};

export interface CourseWithSeats {
  course: {
    id: string;
    name: string;
    code: string;
    credits: number;
    department: {
      id: string;
      name: string;
      schoolId: string;
    };
  };
  totalSeats: number | null;
}

export interface CourseBucketWithSeats {
  courseBucket: {
    id: string;
    name: string;
    totalCredits: number;
    department: {
      id: string;
      name: string;
      schoolId: string;
    };
    courses: {
      course: Course;
      orderIndex: number;
    }[];
  };
  totalSeats: number | null;
}

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
