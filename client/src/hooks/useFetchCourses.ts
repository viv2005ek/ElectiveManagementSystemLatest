import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosInstance.ts';

interface Department {
  id: string;
  name: string;
  isDeleted: boolean;
}

interface CourseCategory {
  id: string;
  name: string;
  isDeleted: boolean;
  allotmentType: string;
}

interface CourseBucket {
  id: string;
  name: string;
  departmentId: string;
  isDeleted: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  isDeleted: boolean;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department: Department;
}

interface ApiResponse {
  courses: Course[];
  count: number;
}

const useFetchCourses = (categoryId?: string | null) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!categoryId) {
        setCourses([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/courses/by-category/${categoryId}`);
        setCourses(response.data.courses);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [categoryId]);

  return { courses, loading, error };
};

export default useFetchCourses;
