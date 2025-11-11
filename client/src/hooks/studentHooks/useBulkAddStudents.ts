/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const { programs } = useFetchPrograms();
  const { batches } = useFetchBatches();
  const { semesters } = useFetchSemesters();

  // Password generator function
  const generatePassword = (student: any) => {
    // const firstNamePart = student.firstName ? student.firstName.substring(0, 3).toLowerCase() : 'usr';
    // const lastNamePart = student.lastName ? student.lastName.substring(0, 3).toLowerCase() : 'std';
    // const regPart = student.registrationNumber ? student.registrationNumber.slice(-4) : '0000';
    // const emailPart = student.email ? student.email.split('@')[0].substring(0, 3).toLowerCase() : 'eml';

    return `${student.registrationNumber.toUpperCase()}`;
  };

  // Process students in batches of 5 with no timeout
  const processStudentsInBatches = async (studentsData: any[]) => {
    setBulkLoading(true);
    setBulkError(null);
    abortControllerRef.current = new AbortController();

    const results = {
      successful: [] as any[],
      failed: [] as any[]
    };

    const BATCH_SIZE = 10;
    const totalBatches = Math.ceil(studentsData.length / BATCH_SIZE);

    try {
      setUploadProgress({ 
        processed: 0, 
        total: studentsData.length,
        currentRecord: { firstName: 'Starting batch processing...' }
      });

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        // Check if upload was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Upload cancelled by user');
        }

        const startIdx = batchIndex * BATCH_SIZE;
        const endIdx = Math.min(startIdx + BATCH_SIZE, studentsData.length);
        const batch = studentsData.slice(startIdx, endIdx);

        // Update progress for current batch
        setUploadProgress({ 
          processed: startIdx, 
          total: studentsData.length,
          currentRecord: {
            firstName: `Processing batch ${batchIndex + 1}/${totalBatches}`,
            lastName: `${batch.length} students`,
            email: ''
          }
        });

        // console.log(`Processing batch ${batchIndex + 1}/${totalBatches} with ${batch.length} students`);

        try {
          // Send batch of 5 students with NO timeout
          const response = await axiosInstance.post('/students/bulk-add', {
            students: batch
          }, {
            timeout: 0, // NO TIMEOUT - let it take as long as needed
            signal: abortControllerRef.current?.signal,
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

          // console.log(`Batch ${batchIndex + 1} completed: ${response.data.successful?.length || 0} successful, ${response.data.failed?.length || 0} failed`);

        } catch (error: any) {
          console.error(`Batch ${batchIndex + 1} failed:`, error);
          
          // Mark all students in this batch as failed
          batch.forEach(student => {
            results.failed.push({
              ...student,
              error: error.response?.data?.message || error.message || 'Batch upload failed'
            });
          });
        }

        // Small delay between batches to prevent overwhelming the server
        if (batchIndex < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Final progress update
      setUploadProgress({ 
        processed: studentsData.length, 
        total: studentsData.length,
        currentRecord: { firstName: 'Processing completed!' }
      });

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
      console.error('Batch processing error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to process students';
      setBulkError(errorMessage);
      setBulkLoading(false);
      setUploadProgress(null);
      throw err;
    } finally {
      abortControllerRef.current = null;
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'firstName',
      'lastName', 
      'email',
      'registrationNumber',
      'contactNumber',
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
      setUploadProgress({ 
        processed: 0, 
        total: totalRows,
        currentRecord: { firstName: 'Validating CSV file...' }
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const headers = lines[0].split(',').map(h => h.trim());
      
      const requiredHeaders = ['firstName', 'lastName', 'email', 'registrationNumber', 'semester', 'program', 'batch'];
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}. Please use the provided template.`);
      }

      processedStudents = [];
      failedStudents = [];

      // Create lookup maps for faster validation
      const programMap = new Map();
      programs.forEach(program => {
        const programName = program.name.toLowerCase().trim();
        programMap.set(programName, program);
        
        // Also add variations without department
        const programNameWithoutDept = programName.replace(/\s*\([^)]*\)\s*$/, '').trim();
        if (programNameWithoutDept !== programName) {
          programMap.set(programNameWithoutDept, program);
        }
        
        // Also add base name (before parentheses)
        const baseProgramName = programName.split('(')[0].trim();
        if (baseProgramName !== programName) {
          programMap.set(baseProgramName, program);
        }
      });

      const batchMap = new Map();
      batches.forEach(batch => {
        batchMap.set(batch.year.toString(), batch);
      });

      const semesterNumbers = new Set(semesters.map(s => s.number));

      // Track duplicates within the CSV file itself
      const seenEmails = new Set();
      const seenRegNumbers = new Set();

      for (let i = 1; i < lines.length; i++) {
        setUploadProgress({ 
          processed: i, 
          total: totalRows,
          currentRecord: {
            firstName: `Validating row ${i}/${totalRows}`,
            lastName: '',
            email: ''
          }
        });

        await new Promise(resolve => setTimeout(resolve, 10));

        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length < requiredHeaders.length) {
          failedStudents.push({
            firstName: values[0] || 'Unknown',
            lastName: values[1] || 'Unknown',
            email: values[2] || 'Unknown',
            registrationNumber: values[3] || 'Unknown',
            contactNumber: values[4] || '',
            semester: values[5] || '',
            program: values[6] || '',
            batch: values[7] || '',
            error: 'Incomplete record - missing required fields'
          });
          continue;
        }

        const csvStudent = {
          firstName: values[0] || '',
          lastName: values[1] || '',
          email: values[2] || '',
          registrationNumber: values[3] || '',
          contactNumber: values[4] || '',
          gender: "Male",
          semester: parseInt(values[5]) || 1,
          program: values[6] || '',
          batch: values[7] || ''
        };

        // Validate required fields
        if (!csvStudent.firstName || !csvStudent.lastName || !csvStudent.email || !csvStudent.registrationNumber) {
          failedStudents.push({
            ...csvStudent,
            error: 'Missing required fields (firstName, lastName, email, or registrationNumber)'
          });
          continue;
        }

        // Check for duplicates within CSV
        if (seenEmails.has(csvStudent.email)) {
          failedStudents.push({
            ...csvStudent,
            error: 'Duplicate email within CSV file'
          });
          continue;
        }

        if (seenRegNumbers.has(csvStudent.registrationNumber)) {
          failedStudents.push({
            ...csvStudent,
            error: 'Duplicate registration number within CSV file'
          });
          continue;
        }

        seenEmails.add(csvStudent.email);
        seenRegNumbers.add(csvStudent.registrationNumber);

        // Validate program using pre-built map
        const programName = csvStudent.program.toLowerCase().trim();
        let program = programMap.get(programName);
        
        if (!program) {
          // Try without department
          const programNameWithoutDept = programName.replace(/\s*\([^)]*\)\s*$/, '').trim();
          program = programMap.get(programNameWithoutDept);
        }
        
        if (!program) {
          // Try base name
          const baseProgramName = programName.split('(')[0].trim();
          program = programMap.get(baseProgramName);
        }

        if (!program) {
          failedStudents.push({
            ...csvStudent,
            error: `Program not found: "${csvStudent.program}"`
          });
          continue;
        }

        // Validate batch using pre-built map
        let batchYear = csvStudent.batch.toString().trim();
        if (batchYear.toLowerCase().startsWith('batch ')) {
          batchYear = batchYear.substring(6).trim();
        }
        
        const batch = batchMap.get(batchYear);
        if (!batch) {
          failedStudents.push({
            ...csvStudent,
            error: `Batch not found: "${csvStudent.batch}"`
          });
          continue;
        }

        // Validate semester
        if (!semesterNumbers.has(csvStudent.semester)) {
          failedStudents.push({
            ...csvStudent,
            error: `Invalid semester: "${csvStudent.semester}". Must be between 1-12`
          });
          continue;
        }

        const generatedPassword = generatePassword(csvStudent);

        const finalStudent = {
          firstName: csvStudent.firstName,
          lastName: csvStudent.lastName,
          email: csvStudent.email,
          registrationNumber: csvStudent.registrationNumber,
          contactNumber: csvStudent.contactNumber,
          gender: "Male",
          semester: csvStudent.semester,
          programId: program.id,
          batchId: batch.id,
          password: generatedPassword
        };

        processedStudents.push(finalStudent);
      }

      setUploadProgress({ 
        processed: totalRows, 
        total: totalRows,
        currentRecord: { firstName: 'Sending validated data in batches of 5...' }
      });

      await new Promise(resolve => setTimeout(resolve, 500));

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

      // console.log(`Sending ${processedStudents.length} validated students in batches of 5`);

      // Send validated students in batches of 5 with no timeout
      const result = await processStudentsInBatches(processedStudents);
      
      // Combine pre-validation failures with API failures
      const allFailed = [
        ...failedStudents,
        ...(result.failed || [])
      ];

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
        student.semester || '',
        student.programName || student.program || '',
        student.batchYear || student.batch || '',
        student.defaultPassword || student.password
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
      'Semester', 
      'Program', 
      'Batch',
      'WouldBePassword',
      'Error'
    ];
    
    const csvContent = [
      headers.join(','),
      ...bulkResult.failed.map(failed => {
        const wouldBePassword = generatePassword(failed);
        
        return [
          failed.firstName || '',
          failed.lastName || '',
          failed.email || '',
          failed.registrationNumber || '',
          failed.contactNumber || '',
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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setBulkLoading(false);
    setUploadProgress(null);
    setBulkError('Upload cancelled by user');
  };

  return {
    bulkAddStudents: processStudentsInBatches,
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