import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance.ts";

export interface CourseCategory {
  id: string;
  name: string;
  isDeleted: boolean;
  allotmentType: "BUCKET" | "STANDALONE";
}

interface UseCourseCategoriesReturn {
  courseCategories: CourseCategory[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useCourseCategories = (): UseCourseCategoriesReturn => {
  const [courseCategories, setCourseCategories] = useState<CourseCategory[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseCategories = async () => {
      try {
        const response = await axiosInstance.get("/course-categories");
        setCourseCategories(response.data);
      } catch (err) {
        setError("Error fetching Course Categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseCategories();
  }, []);

  return { courseCategories, isLoading, error };
};
