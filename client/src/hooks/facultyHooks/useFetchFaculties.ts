import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../axiosInstance.ts";

export interface Faculty {
  id: string;
  name: string;
}

export default function useFetchFaculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchFaculties() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get<Faculty[]>("/faculties");
      setFaculties(data);
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err.response
          ? err.response.data.message || "Failed to fetch faculties"
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFaculties();
  }, []);

  return { faculties, loading, error, refetch: fetchFaculties };
}
