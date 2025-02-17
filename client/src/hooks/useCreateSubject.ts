import { useState } from 'react';
import axiosInstance from '../axiosInstance.ts';
import { CourseCategory } from '../hooks/useCourseCategories.ts';

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

interface UseCreateSubjectReturn {
  createSubject: (payload: CreateSubjectPayload, category: CourseCategory, isOptableAcrossDepartment: boolean) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function useCreateSubject(): UseCreateSubjectReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    isOptableAcrossDepartment: boolean
  ) => {
    setIsLoading(true);
    setError(null);

    // Build the request body conditionally
    const requestBody: CreateSubjectPayload = {
      name,
      batch,
      categoryId: category.id,
      branchIds,
      canOptOutsideDepartment: isOptableAcrossDepartment,
      courseIds: category.allotmentType === 'STANDALONE' ? courseIds : undefined,
      courseBucketIds: category.allotmentType === 'BUCKET' ? courseBucketIds : undefined,
      semesters: category.allotmentType === 'BUCKET' ? semesters : undefined,
      semester: category.allotmentType === 'STANDALONE' ? semester : undefined,
      departmentId: isOptableAcrossDepartment ? undefined : departmentId,
    };

    try {
      const response = await axiosInstance.post('/subjects', requestBody);
      console.log('Subject created successfully:', response.data);
    } catch (err: any) {
      console.error('Error creating subject:', err);
      setError(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setIsLoading(false);
    }
  };

  return { createSubject, isLoading, error };
}
