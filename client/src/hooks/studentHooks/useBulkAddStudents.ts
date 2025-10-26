// hooks/studentHooks/useBulkAddStudents.ts
import { useState, useRef } from "react";
import axiosInstance from "../../axiosInstance.ts";
import { useFetchPrograms } from "../programHooks/useFetchPrograms.ts";
import useFetchBatches from "../batchHooks/useFetchBatches.ts";
import useFetchSemesters from "../semesterHooks/useFetchSemesters.ts";

interface BulkStudentData {
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  contactNumber?: string;
  gender: string;
  semester: number;
  program: string;
  batch: string;
}

interface BulkResult {
  successful: any[];
  failed: any[];
  summary: {
    successCount: number;
    failedCount: number;
    totalProcessed: number;
  };
}

interface UploadProgress {
  processed: number;
  total: number;
  currentRecord?: any;
}

export default function useBulkAddStudents() {
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { programs } = useFetchPrograms();
  const { batches } = useFetchBatches();
  const { semesters } = useFetchSemesters();

  // Password generator function
  const generatePassword = (student: any) => {
    const firstNamePart = student.firstName ? student.firstName.substring(0, 3).toLowerCase() : 'usr';
    const lastNamePart = student.lastName ? student.lastName.substring(0, 3).toLowerCase() : 'std';
    const regPart = student.registrationNumber ? student.registrationNumber.slice(-4) : '0000';
    const emailPart = student.email ? student.email.split('@')[0].substring(0, 3).toLowerCase() : 'eml';
    
    return `${firstNamePart}${lastNamePart}${regPart}${emailPart}`;
  };

  // Main bulk upload function
  const bulkAddStudents = async (studentsData: any[]) => {
    setBulkLoading(true);
    setBulkError(null);
    
    try {
      // Show processing state
      setUploadProgress({ 
        processed: 0, 
        total: studentsData.length,
        currentRecord: { firstName: 'Starting API upload...' }
      });

      // Process in smaller batches to avoid transaction timeout
      const BATCH_SIZE = 5;
      const results = {
        successful: [] as any[],
        failed: [] as any[]
      };

      for (let i = 0; i < studentsData.length; i += BATCH_SIZE) {
        const batch = studentsData.slice(i, i + BATCH_SIZE);
        
        // Update progress for current batch
        setUploadProgress({ 
          processed: i, 
          total: studentsData.length,
          currentRecord: {
            firstName: batch[0]?.firstName || 'Processing...',
            lastName: batch[0]?.lastName || '',
            email: batch[0]?.email || ''
          }
        });

        try {
          const response = await axiosInstance.post('/students/bulk-add', {
            students: batch
          }, {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.data.successful) {
            results.successful.push(...response.data.successful);
          }
          if (response.data.failed) {
            results.failed.push(...response.data.failed);
          }

          // Small delay between batches to prevent overwhelming the server
          if (i + BATCH_SIZE < studentsData.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }

        } catch (error: any) {
          console.error('Batch upload failed:', error);
          
          // Add all students in this batch to failed with specific error
          batch.forEach(student => {
            results.failed.push({
              ...student,
              error: error.response?.data?.message || error.message || 'Batch upload failed - transaction timeout'
            });
          });
        }
      }

      // Final progress update
      setUploadProgress({ 
        processed: studentsData.length, 
        total: studentsData.length,
        currentRecord: { firstName: 'Finalizing...' }
      });

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      setBulkLoading(false);
      return {
        successful: results.successful,
        failed: results.failed,
        summary: {
          successCount: results.successful.length,
          failedCount: results.failed.length,
          totalProcessed: studentsData.length
        }
      };

    } catch (err: any) {
      console.error('Bulk upload error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload students';
      setBulkError(errorMessage);
      setBulkLoading(false);
      setUploadProgress(null);
      throw err;
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'firstName',
      'lastName', 
      'email',
      'registrationNumber',
      'contactNumber',
      'gender',
      'semester',
      'program',
      'batch'
    ];

    const exampleData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@university.edu',
        registrationNumber: '20240001',
        contactNumber: '+1234567890',
        gender: 'Male',
        semester: '1',
        program: 'B.Tech Computer Science (Computer Science and Engineering)',
        batch: '2024'
      }
    ];

    let csvContent = headers.join(',') + '\n';
    exampleData.forEach(row => {
      csvContent += Object.values(row).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    setBulkError(null);

    // Define variables at the function scope to avoid reference errors
    let processedStudents: any[] = [];
    let failedStudents: any[] = [];
    let totalRows = 0;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length <= 1) {
        throw new Error('CSV file is empty or only contains headers');
      }

      totalRows = lines.length - 1;
      setUploadProgress({ processed: 0, total: totalRows });

      // Small delay to show initial progress
      await new Promise(resolve => setTimeout(resolve, 100));

      const headers = lines[0].split(',').map(h => h.trim());
      
      // Validate required headers
      const requiredHeaders = ['firstName', 'lastName', 'email', 'registrationNumber', 'semester', 'program', 'batch'];
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}. Please use the provided template.`);
      }

      // Reset arrays
      processedStudents = [];
      failedStudents = [];

      for (let i = 1; i < lines.length; i++) {
        // Update progress for every row processed
        setUploadProgress({ 
          processed: i, 
          total: totalRows,
          currentRecord: {
            firstName: lines[i].split(',')[0] || 'Processing...',
            lastName: lines[i].split(',')[1] || '',
            email: lines[i].split(',')[2] || ''
          }
        });

        // Add small delay to show progress animation
        await new Promise(resolve => setTimeout(resolve, 50));

        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length < requiredHeaders.length) {
          failedStudents.push({
            firstName: values[0] || 'Unknown',
            lastName: values[1] || 'Unknown',
            email: values[2] || 'Unknown',
            registrationNumber: values[3] || 'Unknown',
            error: 'Incomplete record - missing required fields'
          });
          continue;
        }

        // Create student object from CSV values
        const csvStudent = {
          firstName: values[0] || '',
          lastName: values[1] || '',
          email: values[2] || '',
          registrationNumber: values[3] || '',
          contactNumber: values[4] || '',
          gender: values[5] || 'Male',
          semester: parseInt(values[6]) || 1,
          program: values[7] || '',
          batch: values[8] || ''
        };

        // Validate required fields
        if (!csvStudent.firstName || !csvStudent.lastName || !csvStudent.email || !csvStudent.registrationNumber) {
          failedStudents.push({
            ...csvStudent,
            error: 'Missing required fields (firstName, lastName, email, or registrationNumber)'
          });
          continue;
        }

        // DEBUG: Log what we're trying to match
        console.log(`Looking for program: "${csvStudent.program}"`);

        // FIXED: Map program name to programId with better matching
        const program = programs.find(p => {
          const programName = p.name.toLowerCase().trim();
          const csvProgram = csvStudent.program.toLowerCase().trim();
          
          // Exact match first
          if (programName === csvProgram) {
            console.log(`✓ Exact match found: "${p.name}"`);
            return true;
          }
          
          // Remove department part in parentheses for matching
          const programNameWithoutDept = programName.replace(/\s*\([^)]*\)\s*$/, '').trim();
          const csvProgramWithoutDept = csvProgram.replace(/\s*\([^)]*\)\s*$/, '').trim();
          
          // Match without department
          if (programNameWithoutDept === csvProgramWithoutDept) {
            console.log(`✓ Match without department: "${p.name}" -> "${csvStudent.program}"`);
            return true;
          }
          
          // Also try matching the base name (before parentheses)
          const baseProgramName = programName.split('(')[0].trim();
          const baseCsvProgram = csvProgram.split('(')[0].trim();
          
          if (baseProgramName === baseCsvProgram) {
            console.log(`✓ Base name match: "${p.name}" -> "${csvStudent.program}"`);
            return true;
          }
          
          return false;
        });
        
        if (!program) {
          console.log(`✗ Program not found: "${csvStudent.program}". Available:`, programs.map(p => p.name));
          failedStudents.push({
            ...csvStudent,
            error: `Program not found: "${csvStudent.program}". Available: ${programs.map(p => p.name).join(', ')}`
          });
          continue;
        }

        // FIXED: Map batch year to batchId - remove "Batch " prefix if present
        const batch = batches.find(b => {
          const batchYear = b.year.toString();
          let csvBatch = csvStudent.batch.toString().trim();
          
          // Remove "Batch " prefix if present
          if (csvBatch.toLowerCase().startsWith('batch ')) {
            csvBatch = csvBatch.substring(6).trim();
          }
          
          return batchYear === csvBatch;
        });
        
        if (!batch) {
          failedStudents.push({
            ...csvStudent,
            error: `Batch not found: "${csvStudent.batch}". Available: ${batches.map(b => b.year).join(', ')}`
          });
          continue;
        }

        // Validate semester exists
        const semesterExists = semesters.find(s => s.number === csvStudent.semester);
        if (!semesterExists) {
          failedStudents.push({
            ...csvStudent,
            error: `Invalid semester: "${csvStudent.semester}". Available: ${semesters.map(s => s.number).join(', ')}`
          });
          continue;
        }

        // Generate password for the student
        const generatedPassword = generatePassword(csvStudent);

        // Create final student object with IDs and generated password
        const finalStudent = {
          firstName: csvStudent.firstName,
          lastName: csvStudent.lastName,
          email: csvStudent.email,
          registrationNumber: csvStudent.registrationNumber,
          contactNumber: csvStudent.contactNumber,
          gender: csvStudent.gender,
          semester: csvStudent.semester,
          programId: program.id,
          batchId: batch.id,
          password: generatedPassword // Use generated password instead of hardcoded one
        };

        processedStudents.push(finalStudent);
        console.log(`✓ Successfully mapped: ${finalStudent.firstName} ${finalStudent.lastName} to Program: "${program.name}", Batch: ${batch.year}, Password: ${generatedPassword}`);
      }

      // Final progress update before API call
      setUploadProgress({ 
        processed: totalRows, 
        total: totalRows,
        currentRecord: { firstName: 'Sending to API...' }
      });

      // Small delay to show final progress state
      await new Promise(resolve => setTimeout(resolve, 500));

      // If no valid students found
      if (processedStudents.length === 0) {
        setBulkResult({
          successful: [],
          failed: failedStudents,
          summary: {
            successCount: 0,
            failedCount: failedStudents.length,
            totalProcessed: totalRows
          }
        });
        setBulkLoading(false);
        setUploadProgress(null);
        return;
      }

      console.log(`Sending ${processedStudents.length} students to API`);

      // Send to API with proper loading state management
      try {
        const result = await bulkAddStudents(processedStudents);
        
        // Combine API failures with our pre-validation failures
        const allFailed = [
          ...failedStudents,
          ...(result.failed || [])
        ];

        // Set the final bulk result
        setBulkResult({
          successful: result.successful || [],
          failed: allFailed,
          summary: {
            successCount: result.successful?.length || 0,
            failedCount: allFailed.length,
            totalProcessed: totalRows
          }
        });

      } catch (error: any) {
        console.error('API call failed:', error);
        
        // Define failedStudents in the catch scope to fix the ReferenceError
        const allFailed = [
          ...failedStudents,
          ...processedStudents.map(student => ({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            registrationNumber: student.registrationNumber,
            error: 'API request failed: ' + (error.message || 'Unknown error')
          }))
        ];

        // Set the final bulk result
        setBulkResult({
          successful: [],
          failed: allFailed,
          summary: {
            successCount: 0,
            failedCount: allFailed.length,
            totalProcessed: totalRows
          }
        });
      }

    } catch (error: any) {
      console.error('File processing error:', error);
      setBulkError(error.message || 'Failed to process CSV file. Please check the format and try again.');
    } finally {
      setBulkLoading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const exportSuccessfulRecords = () => {
    if (!bulkResult?.successful.length) return;
    
    const headers = [
      'FirstName', 
      'LastName', 
      'Email', 
      'RegistrationNumber', 
      'ContactNumber',
      'Gender',
      'Semester', 
      'Program', 
      'Batch',
      'DefaultPassword'
    ];
    
    const csvContent = [
      headers.join(','),
      ...bulkResult.successful.map(student => [
        student.firstName || '',
        student.lastName || '',
        student.email || '',
        student.registrationNumber || '',
        student.contactNumber || '',
        student.gender || 'Male',
        student.semester || '',
        student.programName || student.program || '',
        student.batchYear || student.batch || '',
        student.defaultPassword // This is the actual password used in API
      ].join(','))
    ].join('\n');

    downloadCSV(csvContent, 'successful_students.csv');
  };

  const exportFailedRecords = () => {
    if (!bulkResult?.failed.length) return;
    
    const headers = [
      'FirstName', 
      'LastName', 
      'Email', 
      'RegistrationNumber', 
      'ContactNumber',
      'Gender',
      'Semester', 
      'Program', 
      'Batch',
      'WouldBePassword',
      'Error'
    ];
    
    const csvContent = [
      headers.join(','),
      ...bulkResult.failed.map(failed => {
        // Generate what the password would have been
        const wouldBePassword = generatePassword(failed);
        
        return [
          failed.firstName || '',
          failed.lastName || '',
          failed.email || '',
          failed.registrationNumber || '',
          failed.contactNumber || '',
          failed.gender || 'Male',
          failed.semester || '',
          failed.program || '',
          failed.batch || '',
          wouldBePassword,
          `"${failed.error || 'Unknown error'}"`
        ].join(',');
      })
    ].join('\n');

    downloadCSV(csvContent, 'failed_students.csv');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const resetBulkResults = () => {
    setBulkResult(null);
    setBulkError(null);
  };

  const cancelBulkUpload = () => {
    setBulkLoading(false);
    setUploadProgress(null);
    setBulkError('Upload cancelled');
  };

  return {
    bulkAddStudents,
    bulkLoading,
    bulkError,
    bulkResult,
    uploadProgress,
    downloadTemplate,
    exportSuccessfulRecords,
    exportFailedRecords,
    handleFileUpload,
    fileInputRef,
    resetBulkResults,
    cancelBulkUpload
  };
}