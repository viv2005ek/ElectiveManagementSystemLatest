import { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { useNotification } from '../../contexts/NotificationContext.tsx';
import axios from 'axios';

interface SchoolResponse {
  id: string;
  name: string;
  facultyId: string;
}

export default function useCreateSchool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  async function createSchool(name: string, facultyId: string) {
    setLoading(true);
    setError(null);

    const createSchoolPromise = axiosInstance.post<SchoolResponse>("/schools", {
      name,
      facultyId,
    });

    notify(
      "promise",
      "Creating school...",
      createSchoolPromise,
      "Failed to create school",
    );

    try {
      const { data } = await createSchoolPromise;
      return data;
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err?.response
          ? err.response.data.message || "Failed to create school"
          : "Something went wrong",
      );
      notify("error", "Failed to create school");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createSchool, loading, error };
}
