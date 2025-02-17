import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance.ts';

import { CourseCategory } from './useCourseCategories.ts';

const useFetchCourseCategoryById = (id: string | null) => {
  const [category, setCategory] = useState<CourseCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setCategory(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/course-categories/${id}`);
        if (response.status === 200) {
          setCategory(response.data);
        } else {
          setError('Unexpected response from the server');
        }
      } catch (err: any) {
        if (err.response) {
          switch (err.response.status) {
            case 404:
              setError('Course category not found');
              break;
            case 500:
              setError('Internal server error');
              break;
            default:
              setError(err.response.data.message || 'Failed to fetch course category');
          }
        } else {
          setError(err.message || 'Failed to fetch course category');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, loading, error };
};

export default useFetchCourseCategoryById;
