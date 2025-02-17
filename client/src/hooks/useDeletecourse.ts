import { useState } from 'react';
import axiosInstance from '../axiosInstance.ts';

const useDeleteCourse = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteCourse = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    setSuccess(false) ;

    try {
      const response = await axiosInstance.delete(`/courses/${id}`);
      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError('Unexpected response from the server');
      }
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setError('Course not found');
            break;
          case 500:
            setError('Internal server error');
            break;
          default:
            setError(err.response.data.message || 'Failed to delete the course');
        }
      } else {
        setError(err.message || 'Failed to delete the course');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteCourse, isDeleting, error, success };
};

export default useDeleteCourse;
