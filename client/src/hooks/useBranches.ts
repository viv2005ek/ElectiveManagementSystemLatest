import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosInstance.ts';

interface Department {
  id: string;
  name: string;
  isDeleted: boolean;
}

export interface Branch {
  id: string;
  name: string;
  departmentId: string;
  isDeleted: boolean;
  department: Department;
}

export function useBranches(departmentId?: string) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = departmentId
          ? `/branches/department/${departmentId}`
          : '/branches';
        const response = await axiosInstance.get<Branch[]>(url);
        setBranches(response.data);
      } catch (err) {
        setError('Failed to fetch branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [departmentId]);

  return { branches, loading, error };
}
