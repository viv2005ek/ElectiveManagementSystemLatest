import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance.ts";

interface Department {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  name: string;
  departmentId: string;
  department: Department;
}

const useBranches = (
  isOptableAcrossDepartment: boolean,
  department: Department | null,
) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (department) queryParams.append("departmentId", department.id);

        const response = await axiosInstance.get(
          `/branches?${queryParams.toString()}`,
        );
        setBranches(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch branches");
      } finally {
        setLoading(false);
      }
    };

    if (department === null && !isOptableAcrossDepartment) {
      setBranches([]);
      return;
    }

    fetchBranches();
  }, [department, isOptableAcrossDepartment]);

  return { branches, loading, error };
};

export default useBranches;
