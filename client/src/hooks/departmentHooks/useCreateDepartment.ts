import {useState} from "react";
import axiosInstance from "../../axiosInstance";
import {useNotification} from "../../contexts/NotificationContext.tsx";
import axios from "axios";

interface DepartmentResponse {
  id: string;
  name: string;
  schoolId: string;
}

export default function useCreateDepartment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  async function createDepartment(name: string, schoolId: string) {
    setLoading(true);
    setError(null);

    const createDepartmentPromise = axiosInstance.post<DepartmentResponse>(
      "/departments",
      {
        name,
        schoolId,
      },
    );

    notify(
      "promise",
      "Creating department...",
      createDepartmentPromise,
      "Failed to create department",
    );

    try {
      const { data } = await createDepartmentPromise;
      return data;
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err?.response
          ? err.response.data.message || "Failed to create department"
          : "Something went wrong",
      );
      notify("error", "Failed to create department");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createDepartment, loading, error };
}
