import { useState, useRef } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface CreateProfessorData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  departmentId: string;
  professorRankId: string;
  password: string;
}

interface BulkUploadResult {
  message: string;
  summary: {
    totalProcessed: number;
    successCount: number;
    failedCount: number;
  };
  successful: Array<{
    id: string;
    email: string;
    registrationNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    departmentId: string;
    departmentName: string;
    professorRankId: string;
    professorRankName: string;
    defaultPassword: string;
    message: string;
  }>;
  failed: Array<{
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    registrationNumber: string;
    department: string;
    professorRank: string;
    error: string;
    index?: number;
  }>;
}

interface Department {
  id: string;
  name: string;
  school: {
    id: string;
    name: string;
  };
}

interface ProfessorRank {
  id: string;
  name: string;
  priority: number;
}

interface UseCreateProfessorProps {
  departments: Department[];
  professorRanks: ProfessorRank[];
}

interface UploadProgress {
  processed: number;
  total: number;
  currentRecord?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function useCreateProfessor({ departments, professorRanks }: UseCreateProfessorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [bulkResult, setBulkResult] = useState<BulkUploadResult | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        password: data.password
      };

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

  // Map department name to ID
  const getDepartmentIdByName = (departmentName: string): string => {
    const department = departments.find(
      dept => dept.name.toLowerCase() === departmentName.toLowerCase().trim()
    );
    if (!department) {
      throw new Error(`Department not found: ${departmentName}`);
    }
    return department.id;
  };

  // Map professor rank name to ID
  const getProfessorRankIdByName = (rankName: string): string => {
    const rank = professorRanks.find(
      r => r.name.toLowerCase() === rankName.toLowerCase().trim()
    );
    if (!rank) {
      throw new Error(`Professor rank not found: ${rankName}`);
    }
    return rank.id;
  };

  // Download CSV template
  const downloadTemplate = () => {
    const availableDepartments = departments.map(dept => `# - ${dept.name}`).join('\n');
    const availableRanks = professorRanks.map(rank => `# - ${rank.name}`).join('\n');
    
    const template = `firstName,middleName,lastName,email,registrationNumber,department,professorRank
John,,Doe,john.doe@university.edu,PROF001,Computer Science,Professor
Jane,Marie,Smith,jane.smith@university.edu,PROF002,Computer Science,Associate Professor
Michael,James,Brown,michael.brown@university.edu,PROF003,Electrical Engineering,Assistant Professor

# Instructions:
# - All fields except middleName are required
# - Use exact department and professor rank names from the lists below
# - Email and registrationNumber must be unique
# - File must be saved as CSV format
# - Remove this instruction section before uploading
#
# Available Departments:
${availableDepartments}
#
# Available Professor Ranks:
${availableRanks}`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "professors_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export successful records as CSV
  const exportSuccessfulRecords = () => {
    if (!bulkResult?.successful.length) return;

    const headers = "firstName,middleName,lastName,email,registrationNumber,department,professorRank,status,defaultPassword\n";
    const csvContent = bulkResult.successful.map(record => 
      `"${record.firstName}","${record.middleName || ''}","${record.lastName}","${record.email}","${record.registrationNumber}","${record.departmentName}","${record.professorRankName}","Success","${record.defaultPassword}"`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "successful_professors.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export failed records as CSV
  const exportFailedRecords = () => {
    if (!bulkResult?.failed.length) return;

    const headers = "firstName,middleName,lastName,email,registrationNumber,department,professorRank,error\n";
    const csvContent = bulkResult.failed.map(record => 
      `"${record.firstName}","${record.middleName || ''}","${record.lastName}","${record.email}","${record.registrationNumber}","${record.department}","${record.professorRank}","${record.error}"`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "failed_professors.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process CSV file and map names to IDs
  const processCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const lines = csvText.split('\n').filter(line => line.trim() && !line.startsWith('#'));
          
          if (lines.length < 2) {
            reject(new Error("CSV file is empty or invalid"));
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim());
          const requiredHeaders = ['firstName', 'lastName', 'email', 'registrationNumber', 'department', 'professorRank'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            reject(new Error(`Missing required headers: ${missingHeaders.join(', ')}`));
            return;
          }

          const professors = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const professor: any = {};
            
            headers.forEach((header, i) => {
              professor[header] = values[i] || '';
            });

            return professor;
          }).filter(prof => prof.firstName && prof.lastName && prof.email && prof.registrationNumber && prof.department && prof.professorRank);

          if (professors.length === 0) {
            reject(new Error("No valid professor records found in CSV file"));
            return;
          }

          resolve(professors);
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Failed to parse CSV file"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  // Bulk upload professors with individual API calls
  const bulkUploadProfessors = async (file: File) => {
    setBulkLoading(true);
    setError(null);
    setBulkResult(null);

    try {
      const professors = await processCSV(file);
      
      const results = {
        successful: [] as any[],
        failed: [] as Array<{
          firstName: string;
          middleName?: string;
          lastName: string;
          email: string;
          registrationNumber: string;
          department: string;
          professorRank: string;
          error: string;
          index?: number;
        }>
      };

      setUploadProgress({
        processed: 0,
        total: professors.length
      });

      // Process professors sequentially to avoid transaction timeout
      for (let i = 0; i < professors.length; i++) {
        const professorData = professors[i];
        
        setUploadProgress(prev => prev ? {
          ...prev,
          processed: i,
          currentRecord: {
            email: professorData.email,
            firstName: professorData.firstName,
            lastName: professorData.lastName
          }
        } : null);

        try {
          // Map department and rank names to IDs
          const departmentId = getDepartmentIdByName(professorData.department);
          const professorRankId = getProfessorRankIdByName(professorData.professorRank);

          // Get department and rank names for display
          const department = departments.find(dept => dept.id === departmentId);
          const professorRank = professorRanks.find(rank => rank.id === professorRankId);

          // Create individual professor
          const response = await axiosInstance.post("/professors", {
            firstName: professorData.firstName,
            middleName: professorData.middleName,
            lastName: professorData.lastName,
            email: professorData.email,
            registrationNumber: professorData.registrationNumber,
            departmentId: departmentId,
            professorRankId: professorRankId,
            password: `${professorData.firstName.toLowerCase()}${professorData.registrationNumber.slice(-4)}`
          });

          results.successful.push({
            ...response.data.professor,
            departmentName: department?.name || professorData.department,
            professorRankName: professorRank?.name || professorData.professorRank,
            defaultPassword: `${professorData.firstName.toLowerCase()}${professorData.registrationNumber.slice(-4)}`,
            message: "Professor created successfully"
          });

        } catch (err: any) {
          console.error(`Error creating professor ${professorData.email}:`, err);
          
          let errorMessage = "Failed to create professor";
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = err.message;
          }

          results.failed.push({
            firstName: professorData.firstName,
            middleName: professorData.middleName,
            lastName: professorData.lastName,
            email: professorData.email,
            registrationNumber: professorData.registrationNumber,
            department: professorData.department,
            professorRank: professorData.professorRank,
            error: errorMessage,
            index: i
          });
        }

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Final progress update
      setUploadProgress({
        processed: professors.length,
        total: professors.length
      });

      const finalResult = {
        message: results.failed.length === 0 
          ? "All professors created successfully" 
          : `Bulk operation completed with ${results.successful.length} successful and ${results.failed.length} failed`,
        summary: {
          totalProcessed: professors.length,
          successCount: results.successful.length,
          failedCount: results.failed.length
        },
        successful: results.successful,
        failed: results.failed
      };

      setBulkResult(finalResult);
      setBulkLoading(false);
      setUploadProgress(null);
      return finalResult;

    } catch (err: any) {
      console.error("Bulk upload error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to upload professors";
      setError(errorMessage);
      setBulkLoading(false);
      setUploadProgress(null);
      throw err;
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please upload a CSV file");
      return;
    }

    try {
      await bulkUploadProfessors(file);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      // Error already handled in bulkUploadProfessors
    }
  };

  // Reset bulk results
  const resetBulkResults = () => {
    setBulkResult(null);
    setError(null);
    setUploadProgress(null);
  };

  // Cancel bulk upload
  const cancelBulkUpload = () => {
    setBulkLoading(false);
    setUploadProgress(null);
    setError("Upload cancelled by user");
  };

  return {
    createProfessor,
    loading,
    error,
    activeTab,
    setActiveTab,
    bulkResult,
    bulkLoading,
    uploadProgress,
    downloadTemplate,
    exportFailedRecords,
    exportSuccessfulRecords,
    handleFileUpload,
    fileInputRef,
    resetBulkResults,
    cancelBulkUpload
  };
}