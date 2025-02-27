import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import { Faculty } from "../facultyHooks/useFetchFaculties.ts";
import axios from "axios";

export interface School {
  id: string;
  name: string;
  faculty: Faculty;
}

export default function useFetchSchools(facultyId?: string) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get<School[]>("/schools", {
          params: facultyId ? { facultyId } : {}, // Add query param if facultyId exists
        });
        setSchools(data);
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err?.response
            ? err.response.data.message || "Failed to fetch schools"
            : "Something went wrong";

        setError(errorMessage);
        notify("error", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [facultyId]); // 🔹 Re-fetch when facultyId changes

  return { schools, loading, error };
}
