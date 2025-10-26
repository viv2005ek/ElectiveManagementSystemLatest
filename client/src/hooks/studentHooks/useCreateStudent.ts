// hooks/studentHooks/useCreateStudent.ts (Fixed)
import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  contactNumber: string;
  gender: string;
  semester: string;
  programId: string;
  batchId: string;
  password: string;
}

interface CreateStudentResponse {
  message: string;
  summary: {
    totalProcessed: number;
    successCount: number;
    failedCount: number;
  };
  successful: Array<any>;
  failed: Array<{
    email: string;
    registrationNumber: string;
    error: string;
  }>;
}

export default function useCreateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = async (data: CreateStudentData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Creating student with data:", data);
      
      const response = await axiosInstance.post<CreateStudentResponse>("/students", {
        ...data,
        semester: parseInt(data.semester)
      });
      
      setLoading(false);
      console.log("Student creation response:", response.data);
      
      // Check if the operation was successful based on the response structure
      if (response.data.summary && response.data.summary.failedCount > 0) {
        throw new Error(response.data.failed[0]?.error || "Failed to create student");
      }
      
      return response.data;
    } catch (err: any) {
      console.error("Error creating student:", err);
      
      // Handle different error response formats
      let errorMessage = "Failed to create student";
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle bulk-style error response
        if (errorData.failed && errorData.failed.length > 0) {
          errorMessage = errorData.failed[0]?.error || errorData.message || errorMessage;
        } 
        // Handle single student error response
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Handle validation errors array
        else if (Array.isArray(errorData)) {
          errorMessage = errorData.map((e: any) => e.message || e.error).join(', ');
        }
        // Handle string error
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        // Handle object with error property
        else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
      
      // Re-throw with enhanced error information
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).response = err.response;
      throw enhancedError;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { createStudent, loading, error, clearError };
}