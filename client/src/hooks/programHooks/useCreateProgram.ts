import {useState} from "react";
import axiosInstance from "../../axiosInstance.ts";

interface CreateProgramData {
  name: string;
  departmentId: string;
  programType: string;
}

const useCreateProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createProgram = async (programData: CreateProgramData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post("/programs", programData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create program");
    } finally {
      setLoading(false);
    }
  };

  return { createProgram, loading, error, success };
};

export default useCreateProgram;
