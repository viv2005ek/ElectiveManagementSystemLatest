import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import axios from "axios";

interface CourseData {
  code?: string;
  name?: string;
  credits?: number;
  departmentId?: string;
  subjectTypeIds?: string[];
}

const useUpdateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const updateCourse = async (id: string, courseData: CourseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(`/courses/${id}`, courseData);
      setData(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { updateCourse, loading, error, data };
};

export default useUpdateCourse;
