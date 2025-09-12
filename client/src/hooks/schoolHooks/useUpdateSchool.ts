import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import axios from "axios";

interface SchoolData {
  name?: string;
  facultyId?: string;
}

const useUpdateSchool = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const updateSchool = async (id: string, schoolData: SchoolData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/schools/${id}`, schoolData);
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

  return { updateSchool, loading, error, data };
};

export default useUpdateSchool;