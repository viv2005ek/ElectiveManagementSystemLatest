import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { Semester } from "../semesterHooks/useFetchSemesters.ts";
import { SubjectType } from "../subjectTypeHooks/useFetchSubjectTypes.ts";
import axios from "axios";

export interface ActiveSubject {
  id: string;
  name: string;
  subjectType: SubjectType;
  dueDate: string;
  isPreferenceWindowOpen: boolean;
  semester: Semester;
  semesters: Semester[];
}

const useActiveSubjects = () => {
  const [subjects, setSubjects] = useState<ActiveSubject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get<ActiveSubject[]>(
          "/students/active-subjects",
        );
        setSubjects(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.error || "Error fetching subjects");
        } else {
          setError("Error fetching subjects");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return { subjects, loading, error };
};

export default useActiveSubjects;
