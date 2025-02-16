import { useEffect, useState } from "react";
import axios from "axios";

// Define the types for MinorSpecializations and ProgrammeElectives
export interface ProgrammeElective {
  id: string;
  courseCode: string;
  name: string;
  semester: number;
}

export interface MinorSpecialization {
  id: string;
  name: string;
  ProgrammeElectives: ProgrammeElective[];
}

interface UseMinorSpecializationsReturn {
  minorSpecializations: MinorSpecialization[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useMinorSpecializations = (): UseMinorSpecializationsReturn => {
  const [minorSpecializations, setMinorSpecializations] = useState<
    MinorSpecialization[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMinorSpecializations = async () => {
      try {
        // Assuming your API is running on localhost and the endpoint is '/api/minor-specializations'
        const response = await axios.get("/api/minor-specializations");
        setMinorSpecializations(response.data);
      } catch (err) {
        setError("Error fetching Minor Specializations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinorSpecializations();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return { minorSpecializations, isLoading, error };
};
