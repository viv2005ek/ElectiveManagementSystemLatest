import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import axios from "axios";

interface FacultyData {
  name?: string;
}

const useUpdateFaculty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const updateFaculty = async (id: string, facultyData: FacultyData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/faculties/${id}`, facultyData);
      setData(response.data);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateFaculty, loading, error, data };
};

export default useUpdateFaculty;