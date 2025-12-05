// hooks/studentHooks/useUpdateStudent.ts (Updated)
import { useState } from "react";
import axiosInstance from "../../axiosInstance.ts";

export interface UpdateStudentData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  gender: string;
  semester: number;
  programId: string;
  batchId: string;
  password?: string; // Add this
}

interface UpdateStudentResponse {
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

interface UpdateError {
  message: string;
  failed?: Array<{
    email: string;
    registrationNumber: string;
    error: string;
  }>;
  summary?: {
    failedCount: number;
  };
}

export default function useUpdateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<UpdateError | null>(null);

  const updateStudent = async (id: string, data: UpdateStudentData) => {
    setLoading(true);
    setError(null);
    setDetailedError(null);
    
    try {
      const response = await axiosInstance.put<UpdateStudentResponse>(`/students/${id}`, data);
      setLoading(false);
      
      // Check if the operation was successful based on the response format
      if (response.data.summary && response.data.summary.failedCount > 0) {
        const errorData: UpdateError = {
          message: response.data.message || "Update failed",
          failed: response.data.failed,
          summary: response.data.summary
        };
        setDetailedError(errorData);
        setError(response.data.failed?.[0]?.error || "Update failed");
        throw errorData;
      }
      
      return response.data;
    } catch (err: any) {
      setLoading(false);
      
      // Handle different error response formats
      let errorMessage = "Failed to update student";
      let errorDetails: UpdateError | null = null;

      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle bulk-style error response
        if (errorData.failed && Array.isArray(errorData.failed)) {
          errorMessage = errorData.failed[0]?.error || errorData.message || errorMessage;
          errorDetails = {
            message: errorData.message || "Update failed",
            failed: errorData.failed,
            summary: errorData.summary
          };
        } 
        // Handle standard error response
        else if (errorData.message) {
          errorMessage = errorData.message;
          errorDetails = {
            message: errorData.message,
            failed: [{
              email: data.email || 'Unknown',
              registrationNumber: 'Unknown',
              error: errorData.message
            }]
          };
        }
        // Handle validation errors
        else if (errorData.error) {
          errorMessage = errorData.error;
          errorDetails = {
            message: errorData.error,
            failed: [{
              email: data.email || 'Unknown',
              registrationNumber: 'Unknown',
              error: errorData.error
            }]
          };
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setDetailedError(errorDetails);
      
      // Re-throw with enhanced error information
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).details = errorDetails;
      throw enhancedError;
    }
  };

  const clearError = () => {
    setError(null);
    setDetailedError(null);
  };

  return { 
    updateStudent, 
    loading, 
    error, 
    detailedError,
    clearError 
  };
}