import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import axios from "axios";
import { ProgramType } from "./useFetchPrograms.ts";

interface ProgramData {
  name?: string;
  departmentId?: string;
  programType?: ProgramType;
}

const useUpdateProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const updateProgram = async (id: string, programData: ProgramData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/programs/${id}`, programData);
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

  return { updateProgram, loading, error, data };
};

export default useUpdateProgram;