// hooks/courseHooks/useCreateCourseBulk.ts
import { useState, useRef } from "react";
import axiosInstance from "../../axiosInstance.ts";

interface CourseData {
  name: string;
  code: string;
  credits: number;
  departmentId: string;
  subjectTypeIds?: string[];
  semesterId?: string;
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
    name: string;
    code: string;
    credits: number;
    departmentId: string;
    departmentName: string;
    subjectTypeNames: string[];
    semesterName?: string;
    message: string;
  }>;
  failed: Array<{
    name: string;
    code: string;
    credits: string;
    department: string;
    subjectTypes?: string;
    semester?: string;
    error: string;
    index?: number;
  }>;
}

interface Department {
  id: string;
  name: string;
}

interface SubjectType {
  id: string;
  name: string;
}

interface Semester {
  id: string;
  number: number;
}

interface UseCreateCourseBulkProps {
  departments: Department[];
  subjectTypes: SubjectType[];
  semesters: Semester[];
}

interface UploadProgress {
  processed: number;
  total: number;
  currentRecord?: {
    name: string;
    code: string;
  };
}

export default function useCreateCourseBulk({ departments, subjectTypes, semesters }: UseCreateCourseBulkProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [bulkResult, setBulkResult] = useState<BulkUploadResult | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createCourse = async (data: CourseData): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.post("/courses", data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to create course");
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

  // Map subject type names to IDs
  const getSubjectTypeIdsByName = (subjectTypeNames: string): string[] => {
    if (!subjectTypeNames) return [];
    
    const names = subjectTypeNames.split(';').map(name => name.trim());
    const ids: string[] = [];
    
    names.forEach(name => {
      const subjectType = subjectTypes.find(
        st => st.name.toLowerCase() === name.toLowerCase()
      );
      if (subjectType) {
        ids.push(subjectType.id);
      }
    });
    
    return ids;
  };

  // Map semester number to ID
  const getSemesterIdByNumber = (semesterNumber: string): string | undefined => {
    if (!semesterNumber) return undefined;
    
    const semester = semesters.find(
      sem => sem.number.toString() === semesterNumber.trim()
    );
    return semester?.id;
  };

  // Download CSV template
  const downloadTemplate = () => {
    const availableDepartments = departments.map(dept => `# - ${dept.name}`).join('\n');
    const availableSubjectTypes = subjectTypes.map(st => `# - ${st.name}`).join('\n');
    const availableSemesters = semesters.map(sem => `# - ${sem.number}`).join('\n');
    
    const template = `name,code,credits,department,subjectTypes,semester
Introduction to Programming,CS101,4,Computer Science,Core;Theory,1
Data Structures,CS201,3,Computer Science,Core;Lab,2
Digital Electronics,EE101,4,Electrical Engineering,Core,1

# Instructions:
# - All fields except subjectTypes and semester are required
# - Use exact department names from the list below
# - For subjectTypes, use semicolon (;) to separate multiple types
# - Course code must be unique
# - File must be saved as CSV format
# - Remove this instruction section before uploading
#
# Available Departments:
${availableDepartments}
#
# Available Subject Types:
${availableSubjectTypes}
#
# Available Semesters:
${availableSemesters}`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "courses_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export successful records as CSV
  const exportSuccessfulRecords = () => {
    if (!bulkResult?.successful.length) return;

    const headers = "name,code,credits,department,subjectTypes,semester,status\n";
    const csvContent = bulkResult.successful.map(record => 
      `"${record.name}","${record.code}",${record.credits},"${record.departmentName}","${record.subjectTypeNames.join(';')}","${record.semesterName || ''}","Success"`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "successful_courses.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export failed records as CSV
  const exportFailedRecords = () => {
    if (!bulkResult?.failed.length) return;

    const headers = "name,code,credits,department,subjectTypes,semester,error\n";
    const csvContent = bulkResult.failed.map(record => 
      `"${record.name}","${record.code}",${record.credits},"${record.department}","${record.subjectTypes || ''}","${record.semester || ''}","${record.error}"`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "failed_courses.csv");
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
          const requiredHeaders = ['name', 'code', 'credits', 'department'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            reject(new Error(`Missing required headers: ${missingHeaders.join(', ')}`));
            return;
          }

          const courses = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const course: any = {};
            
            headers.forEach((header, i) => {
              course[header] = values[i] || '';
            });

            return course;
          }).filter(course => course.name && course.code && course.credits && course.department);

          if (courses.length === 0) {
            reject(new Error("No valid course records found in CSV file"));
            return;
          }

          resolve(courses);
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Failed to parse CSV file"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  // Bulk upload courses with individual API calls
  const bulkUploadCourses = async (file: File) => {
    setBulkLoading(true);
    setError(null);
    setBulkResult(null);

    try {
      const courses = await processCSV(file);
      
      const results = {
        successful: [] as any[],
        failed: [] as Array<{
          name: string;
          code: string;
          credits: string;
          department: string;
          subjectTypes?: string;
          semester?: string;
          error: string;
          index?: number;
        }>
      };

      setUploadProgress({
        processed: 0,
        total: courses.length
      });

      // Process courses sequentially to avoid overwhelming the server
      for (let i = 0; i < courses.length; i++) {
        const courseData = courses[i];
        
        setUploadProgress(prev => prev ? {
          ...prev,
          processed: i,
          currentRecord: {
            name: courseData.name,
            code: courseData.code
          }
        } : null);

        try {
          // Map names to IDs
          const departmentId = getDepartmentIdByName(courseData.department);
          const subjectTypeIds = getSubjectTypeIdsByName(courseData.subjectTypes);
          const semesterId = getSemesterIdByNumber(courseData.semester);

          // Get names for display
          const department = departments.find(dept => dept.id === departmentId);
          const subjectTypeNames = subjectTypeIds.map(id => 
            subjectTypes.find(st => st.id === id)?.name || ''
          ).filter(name => name);
          const semester = semesters.find(sem => sem.id === semesterId);

          // Create individual course
          const response = await axiosInstance.post("/courses", {
            name: courseData.name,
            code: courseData.code,
            credits: parseInt(courseData.credits),
            departmentId: departmentId,
            subjectTypeIds: subjectTypeIds.length > 0 ? subjectTypeIds : undefined,
            semesterId: semesterId
          });

          // Extract course data from response - handle different response structures
          const courseResponse = response.data;
          // // console.log('Course creation response:', courseResponse); // Debug log

          // Handle different possible response structures
          const successfulCourse = {
            id: courseResponse.id || courseResponse.course?.id || `temp-${i}`,
            name: courseResponse.name || courseResponse.course?.name || courseData.name,
            code: courseResponse.code || courseResponse.course?.code || courseData.code,
            credits: courseResponse.credits || courseResponse.course?.credits || parseInt(courseData.credits),
            departmentId: courseResponse.departmentId || courseResponse.course?.departmentId || departmentId,
            departmentName: department?.name || courseData.department,
            subjectTypeNames: subjectTypeNames,
            semesterName: semester?.number ? `Semester ${semester.number}` : undefined,
            message: "Course created successfully"
          };

          results.successful.push(successfulCourse);

        } catch (err: any) {
          console.error(`Error creating course ${courseData.code}:`, err);
          
          let errorMessage = "Failed to create course";
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = err.message;
          }

          results.failed.push({
            name: courseData.name,
            code: courseData.code,
            credits: courseData.credits,
            department: courseData.department,
            subjectTypes: courseData.subjectTypes,
            semester: courseData.semester,
            error: errorMessage,
            index: i
          });
        }

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Final progress update
      setUploadProgress({
        processed: courses.length,
        total: courses.length
      });

      const finalResult = {
        message: results.failed.length === 0 
          ? "All courses created successfully" 
          : `Bulk operation completed with ${results.successful.length} successful and ${results.failed.length} failed`,
        summary: {
          totalProcessed: courses.length,
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
      const errorMessage = err.response?.data?.message || err.message || "Failed to upload courses";
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
      await bulkUploadCourses(file);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      // Error already handled in bulkUploadCourses
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
    createCourse,
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