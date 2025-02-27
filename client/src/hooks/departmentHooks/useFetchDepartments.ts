import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import { School } from "../schoolHooks/useFetchSchools.ts";
import axios from "axios";

export interface Department {
  id: string;
  name: string;
  school: School;
}

export default function useFetchDepartments(schoolId?: string) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get<Department[]>("/departments", {
          params: schoolId ? { schoolId } : {},
        });
        setDepartments(data);
      } catch (err) {
        setError(
          axios.isAxiosError(err) && err?.response
            ? err.response.data.message || "Failed to fetch departments"
            : "Something went wrong",
        );
        notify("error", "Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [schoolId]);

  return { departments, loading, error };
}
