import { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../axiosInstance.ts';
import { useNotification } from '../../contexts/NotificationContext.tsx';

interface FacultyResponse {
  id: string;
  name: string;
}

export default function useCreateFaculty() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  async function createFaculty(name: string) {
    setLoading(true);
    setError(null);

    const createPromise = axiosInstance
      .post<FacultyResponse>("/faculties", { name })
      .then((response) => response.data);

    notify(
      "promise",
      "Creating faculty...",
      createPromise,
      "Failed to create faculty",
    );

    try {
      return await createPromise;
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err.response
          ? err.response.data.message || "Failed to create faculty"
          : "Something went wrong",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createFaculty, loading, error };
}
