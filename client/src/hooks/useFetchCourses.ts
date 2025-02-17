import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance.ts";

interface Department {
  id: string;
  name: string;
}

interface CourseCategory {
  id: string;
  name: string;
  allotmentType: string;
}

interface CourseBucket {
  id: string;
  name: string;
  departmentId: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department: Department;
}

interface ApiResponse {
  courses: Course[];
  count: number;
}

const useFetchCourses = (
  category: CourseCategory | null,
  department: Department | null,
) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!category) {
        setCourses([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (category) queryParams.append("categoryId", category.id);
        if (department) queryParams.append("departmentId", department.id);

        const response = await axiosInstance.get(
          `/courses?${queryParams.toString()}`,
        );
        setCourses(response.data.courses);
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    setCourses([]);

    fetchCourses();
  }, [category, department]);

  return { courses, loading, error };
};

export default useFetchCourses;
