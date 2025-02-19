import { useState } from "react";
import axiosInstance from "../axiosInstance.ts";
import { CourseCategory } from "./useCourseCategories.ts";

interface CreateSubjectPayload {
  name: string;
  semester?: number;
  batch: number;
  categoryId: string;
  branchIds: string[];
  courseIds?: string[];
  courseBucketIds?: string[];
  semesters?: number[];
  departmentId?: string;
  canOptOutsideDepartment: boolean;
}

export default function useCreateSubject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createSubject = async (
    name: string,
    batch: number,
    category: CourseCategory,
    branchIds: string[],
    courseIds: string[],
    courseBucketIds: string[],
    semesters: number[],
    semester: number | undefined,
    departmentId: string | undefined,
    isOptableAcrossDepartment: boolean,
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const requestBody: CreateSubjectPayload = {
      name,
      batch,
      categoryId: category.id,
      branchIds,
      canOptOutsideDepartment: isOptableAcrossDepartment,
      courseIds:
        category.allotmentType === "STANDALONE" ? courseIds : undefined,
      courseBucketIds:
        category.allotmentType === "BUCKET" ? courseBucketIds : undefined,
      semesters: category.allotmentType === "BUCKET" ? semesters : undefined,
      semester: category.allotmentType === "STANDALONE" ? semester : undefined,
      departmentId: isOptableAcrossDepartment ? undefined : departmentId,
    };

    try {
      const response = await axiosInstance.post("/subjects", requestBody);
      console.log("Subject created successfully:", response.data);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error creating subject:", err);
      // Set error message or throw it to be handled by the caller
      const errorMessage = err.response?.message || "Failed to create subject";
      setError(errorMessage);
      throw new Error(errorMessage); // Ensure the error is thrown
    } finally {
      setIsLoading(false);
    }
  };

  return { createSubject, isLoading, error, success };
}
