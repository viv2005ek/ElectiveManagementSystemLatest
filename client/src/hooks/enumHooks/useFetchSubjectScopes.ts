import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

export default function useFetchSubjectScopes() {
  const [scopes, setScopes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjectScopes = async () => {
      try {
        const response = await axiosInstance.get<string[]>(
          "/enums/subject-scopes",
        );
        setScopes(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectScopes();
  }, []);

  return { scopes, loading, error };
}
