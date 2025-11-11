import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface UpdateProfessorData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  departmentId: string;
  professorRankId: string;
}

export default function useUpdateProfessor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfessor = async (id: string, data: UpdateProfessorData) => {
    setLoading(true);
    setError(null); 
    
    try {
      // Prepare the payload
      const payload = {
        firstName: data.firstName,
        middleName: data.middleName || null, // Send null if empty
        lastName: data.lastName,
        email: data.email,
        departmentId: data.departmentId,
        professorRankId: data.professorRankId
      };

      // console.log("=== UPDATE PROFESSOR PAYLOAD ===");
      // console.log("Professor ID:", id);
      // console.log("Payload:", payload);
      // console.log("ProfessorRankId Type:", typeof payload.professorRankId);
      // console.log("ProfessorRankId Value:", payload.professorRankId);
      // console.log("=== END PAYLOAD ===");

      const response = await axiosInstance.put(`/professors/${id}`, payload);
      
      // console.log("=== UPDATE RESPONSE ===");
      // console.log("Response:", response.data);
      // console.log("=== END RESPONSE ===");

      setLoading(false);
      return response.data;
    } catch (err: any) {
      console.error("=== UPDATE ERROR ===");
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("=== END ERROR ===");
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to update professor";
      
      setError(errorMessage);
      setLoading(false);
      
      // Throw the actual error response so the component can access the details
      throw err;
    }
  };

  return { updateProfessor, loading, error };
}