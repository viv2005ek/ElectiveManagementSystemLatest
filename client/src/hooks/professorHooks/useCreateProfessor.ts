import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface CreateProfessorData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  departmentId: string;
  professorRankId: string;
}

export default function useCreateProfessor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfessor = async (data: CreateProfessorData) => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        registrationNumber: data.registrationNumber,
        departmentId: data.departmentId,
        professorRankId: data.professorRankId,
        password: "password1234"
      };

      console.log("=== SENDING PAYLOAD ===");
      console.log("First Name:", payload.firstName);
      console.log("Middle Name:", payload.middleName);
      console.log("Last Name:", payload.lastName);
      console.log("Email:", payload.email);
      console.log("Registration Number:", payload.registrationNumber);
      console.log("Department ID:", payload.departmentId, "Type:", typeof payload.departmentId);
      console.log("Professor Rank ID:", payload.professorRankId, "Type:", typeof payload.professorRankId);
      console.log("Password:", payload.password);
      console.log("=== END PAYLOAD ===");

      const response = await axiosInstance.post("/professors", payload);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to create professor");
      setLoading(false);
      throw err;
    }
  };

  return { createProfessor, loading, error };
}