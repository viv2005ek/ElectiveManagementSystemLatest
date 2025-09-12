import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import axios from "axios";

interface DepartmentData {
  name?: string;
  schoolId?: string;
}

const useUpdateDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const updateDepartment = async (id: string, departmentData: DepartmentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/departments/${id}`, departmentData);
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

  return { updateDepartment, loading, error, data };
};

export default useUpdateDepartment;