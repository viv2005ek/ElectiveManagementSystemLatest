import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface Department {
  id: string;
  name: string;
  schoolId: string;
}

interface SubjectType {
  id: string;
  name: string;
  allotmentType: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  // departmentId: string;
  department: Department;
  subjectTypes?: SubjectType[];
}

const useFetchCourses = (options?: {
  category?: SubjectType | null;
  categories?: SubjectType[] | null;
  departmentId?: string | null;
  credits?: number;
  semesterId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();

        // Ensure categoryIds is always an array
        const categoryIds = options?.category
          ? [options.category.id]
          : options?.categories?.map((cat) => cat.id) || [];

        categoryIds.forEach((id) => queryParams.append("categoryIds", id));

        if (options?.departmentId)
          queryParams.append("departmentId", options.departmentId);
        if (options?.credits)
          queryParams.append("credits", options.credits.toString());
        if (options?.search) queryParams.append("search", options.search);
        if (options?.page) queryParams.append("page", options.page.toString());
        if (options?.limit)
          queryParams.append("limit", options.limit.toString());

        const response = await axiosInstance.get(
          `/courses?${queryParams.toString()}`,
        );
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [
    options?.categories,
    options?.category,
    options?.credits,
    options?.departmentId,
    options?.limit,
    options?.page,
    options?.semesterId,
    options?.search,
  ]);

  return { courses, loading, error, totalPages };
};

export default useFetchCourses;
