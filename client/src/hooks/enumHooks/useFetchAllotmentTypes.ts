import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

export default function useFetchAllotmentTypes() {
  const [allotmentTypes, setAllotmentTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllotmentTypes = async () => {
      try {
        const response = await axiosInstance.get<string[]>(
          "/enums/allotment-types",
        );
        setAllotmentTypes(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAllotmentTypes();
  }, []);

  return { allotmentTypes, loading, error };
}
