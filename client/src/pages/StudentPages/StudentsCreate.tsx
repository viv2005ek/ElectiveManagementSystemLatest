// StudentsCreate.tsx (Fixed)
import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useNavigate } from "react-router-dom";
import useCreateStudent from "../../hooks/studentHooks/useCreateStudent.ts";
import { useFetchPrograms } from "../../hooks/programHooks/useFetchPrograms.ts";
import useFetchBatches from "../../hooks/batchHooks/useFetchBatches.ts";
import useFetchSemesters from "../../hooks/semesterHooks/useFetchSemesters.ts";
import useBulkAddStudents from "../../hooks/studentHooks/useBulkAddStudents.ts";
import { 
  DocumentArrowUpIcon, 
  DocumentTextIcon, 
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

interface ResultModalData {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | null;
  title: string;
  message: string;
  details?: any;
  failedRecords?: Array<{
    email: string;
    registrationNumber: string;
    error: string;
  }>;
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

export default function StudentsCreate() {
  const navigate = useNavigate();
  const { 
    createStudent, 
    loading: singleLoading, 
    error: singleError,
    clearError: clearSingleError 
  } = useCreateStudent();
  
  const { 
    bulkAddStudents, 
    loading: bulkLoading, 
    error: bulkError,
    bulkResult,
    uploadProgress,
    downloadTemplate,
    handleFileUpload,
    fileInputRef,
    resetBulkResults,
    exportSuccessfulRecords,
    exportFailedRecords,
    cancelBulkUpload
  } = useBulkAddStudents();
  
  const { programs, loading: programsLoading } = useFetchPrograms();
  const { batches, loading: batchesLoading } = useFetchBatches();
  const { semesters, loading: semestersLoading } = useFetchSemesters();
  
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  
  // Single Student Form State
  const [singleForm, setSingleForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    registrationNumber: "",
    contactNumber: "",
    gender: "Male",
    semester: "",
    programId: "",
    batchId: "",
    password: "password123"
  });

  // Result Modal State
  const [resultModal, setResultModal] = useState<ResultModalData>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    details: null
  });

  // Single Student Handlers
  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSingleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form before submission
      const validationErrors = validateStudentForm(singleForm);
      if (validationErrors.length > 0) {
        setResultModal({
          isOpen: true,
          type: 'error',
          title: 'Validation Error',
          message: 'Please fix the following errors:',
          failedRecords: validationErrors.map(error => ({
            email: singleForm.email || 'Unknown',
            registrationNumber: singleForm.registrationNumber || 'Unknown',
            error: error
          }))
        });
        return;
      }

      const result = await createStudent(singleForm);
      
      if (result.successful && result.successful.length > 0) {
        setResultModal({
          isOpen: true,
          type: 'success',
          title: 'Student Created Successfully',
          message: `Student "${singleForm.firstName} ${singleForm.lastName}" has been created successfully with registration number: ${result.successful[0].registrationNumber}`,
          details: result
        });

        // Reset form
        setSingleForm({
          firstName: "",
          lastName: "",
          email: "",
          registrationNumber: "",
          contactNumber: "",
          gender: "Male",
          semester: "",
          programId: "",
          batchId: "",
          password: "password123"
        });
      } else if (result.failed && result.failed.length > 0) {
        setResultModal({
          isOpen: true,
          type: 'error',
          title: 'Failed to Create Student',
          message: 'The student could not be created due to the following error:',
          failedRecords: result.failed
        });
      }

      clearSingleError();
    } catch (error: any) {
      console.error("Failed to create student:", error);
      const errorDetails = error.response?.data;
      
      setResultModal({
        isOpen: true,
        type: 'error',
        title: 'Failed to Create Student',
        message: errorDetails?.message || error.message || 'An unexpected error occurred',
        details: errorDetails,
        failedRecords: errorDetails?.failed || [{
          email: singleForm.email,
          registrationNumber: singleForm.registrationNumber,
          error: errorDetails?.message || error.message || 'Unknown error'
        }]
      });
    }
  };

  // Form validation function
  const validateStudentForm = (formData: typeof singleForm): string[] => {
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) errors.push("First name is required");
    if (!formData.lastName.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.registrationNumber.trim()) errors.push("Registration number is required");
    if (!formData.semester) errors.push("Semester is required");
    if (!formData.programId) errors.push("Program is required");
    if (!formData.batchId) errors.push("Batch is required");
    if (!formData.password.trim()) errors.push("Password is required");
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    
    return errors;
  };

  // Modal Handlers
  const closeModal = () => {
    setResultModal({
      isOpen: false,
      type: null,
      title: '',
      message: '',
      details: null
    });
  };

  const goToStudentsList = () => {
    navigate("/students");
  };

  const handleTabChange = (tab: "single" | "bulk") => {
    setActiveTab(tab);
    if (tab === "single") {
      clearSingleError();
    }
  };

  // Get available semesters for selected program
  const getAvailableSemesters = () => {
    return semesters.filter(semester => 
      semester.number >= 1 && semester.number <= 12
    );
  };

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title="Add Students" />

        {/* Tab Navigation */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange("single")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "single"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <UserPlusIcon className="w-5 h-5 inline mr-2" />
                Single Student
              </button>
              <button
                onClick={() => handleTabChange("bulk")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bulk"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <DocumentArrowUpIcon className="w-5 h-5 inline mr-2" />
                Bulk Upload
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {/* Single Student Form */}
          {activeTab === "single" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {singleError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                  </div>
                  <p className="mt-1 text-sm text-red-600">{singleError}</p>
                </div>
              )}

              <form onSubmit={handleSingleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={singleForm.firstName}
                        onChange={handleSingleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={singleForm.lastName}
                        onChange={handleSingleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter last name"
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={singleForm.gender}
                        onChange={handleSingleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={singleForm.contactNumber}
                        onChange={handleSingleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={singleForm.email}
                        onChange={handleSingleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        id="registrationNumber"
                        name="registrationNumber"
                        required
                        value={singleForm.registrationNumber}
                        onChange={handleSingleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter registration number"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <input
                        type="text"
                        id="password"
                        name="password"
                        required
                        value={singleForm.password}
                        onChange={handleSingleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter password"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Minimum 6 characters. Students will use this to login initially.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                        Semester *
                      </label>
                      <select
                        id="semester"
                        name="semester"
                        required
                        value={singleForm.semester}
                        onChange={handleSingleChange}
                        disabled={semestersLoading}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="">Select Semester</option>
                        {getAvailableSemesters().map((semester) => (
                          <option key={semester.id} value={semester.number}>
                            Semester {semester.number}
                          </option>
                        ))}
                      </select>
                      {semestersLoading && (
                        <p className="mt-1 text-sm text-gray-500">Loading semesters...</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="programId" className="block text-sm font-medium text-gray-700">
                        Program *
                      </label>
                      <select
                        id="programId"
                        name="programId"
                        required
                        value={singleForm.programId}
                        onChange={handleSingleChange}
                        disabled={programsLoading}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="">Select Program</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name} - {program.department?.name || 'Unknown Department'}
                          </option>
                        ))}
                      </select>
                      {programsLoading && (
                        <p className="mt-1 text-sm text-gray-500">Loading programs...</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="batchId" className="block text-sm font-medium text-gray-700">
                        Batch *
                      </label>
                      <select
                        id="batchId"
                        name="batchId"
                        required
                        value={singleForm.batchId}
                        onChange={handleSingleChange}
                        disabled={batchesLoading}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="">Select Batch</option>
                        {batches.map((batch) => (
                          <option key={batch.id} value={batch.id}>
                            {batch.year}
                          </option>
                        ))}
                      </select>
                      {batchesLoading && (
                        <p className="mt-1 text-sm text-gray-500">Loading batches...</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate("/students")}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={singleLoading || programsLoading || batchesLoading || semestersLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {singleLoading ? "Creating..." : "Create Student"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bulk Upload Section */}
          {activeTab === "bulk" && (
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Upload Students</h3>
                
                {/* Download Template */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Download Template</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Use our CSV template with program names, batch years, and semester numbers (no IDs needed).
                      </p>
                    </div>
                    <button
                      onClick={downloadTemplate}
                      disabled={programsLoading || batchesLoading || semestersLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <DocumentTextIcon className="w-4 h-4 mr-2" />
                      {programsLoading || batchesLoading || semestersLoading ? "Loading..." : "Download Template"}
                    </button>
                  </div>
                  {(programsLoading || batchesLoading || semestersLoading) && (
                    <p className="mt-2 text-sm text-blue-600">
                      Loading available programs, batches, and semesters for template...
                    </p>
                  )}
                </div>

                {/* Progress Indicator */}
               {/* Progress Indicator */}
{uploadProgress && (
  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-sm font-medium text-blue-800">
        {bulkLoading ? 'Processing...' : 'Completed'} ({uploadProgress.processed}/{uploadProgress.total})
      </h4>
      <span className="text-sm text-blue-600">
        {Math.round((uploadProgress.processed / uploadProgress.total) * 100)}%
      </span>
    </div>
    <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
      <div 
        className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${(uploadProgress.processed / uploadProgress.total) * 100}%` }}
      ></div>
    </div>
    {uploadProgress.currentRecord && (
      <div className="text-sm text-blue-700">
        <p className="font-medium">Current Status:</p>
        <p>
          {uploadProgress.currentRecord.firstName === 'Starting API upload...' && 'Starting API upload...'}
          {uploadProgress.currentRecord.firstName === 'Finalizing...' && 'Finalizing upload...'}
          {uploadProgress.currentRecord.firstName !== 'Starting API upload...' && 
           uploadProgress.currentRecord.firstName !== 'Finalizing...' && 
           `${uploadProgress.currentRecord.firstName} ${uploadProgress.currentRecord.lastName} ${uploadProgress.currentRecord.email ? `(${uploadProgress.currentRecord.email})` : ''}`}
        </p>
      </div>
    )}
    {bulkLoading && (
      <div className="mt-2">
        <button
          onClick={cancelBulkUpload}
          className="text-sm text-blue-700 hover:text-blue-800 underline"
        >
          Cancel Upload
        </button>
      </div>
    )}
  </div>
)}

                {/* Available Programs, Batches & Semesters Info */}
                <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Available Programs</h4>
                    <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                      {programs.map(program => (
                        <div key={program.id} className="py-1">
                          {program.name} ({program.department?.name})
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Available Batches</h4>
                    <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                      {batches.map(batch => (
                        <div key={batch.id} className="py-1">
                          Batch {batch.year}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Available Semesters</h4>
                    <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                      {getAvailableSemesters().map(semester => (
                        <div key={semester.id} className="py-1">
                          Semester {semester.number}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv"
                    className="hidden"
                    disabled={bulkLoading}
                  />
                  <div className="space-y-2">
                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${bulkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <span>Upload a CSV file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept=".csv"
                          onChange={handleFileUpload}
                          disabled={bulkLoading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV up to 10MB</p>
                    {bulkLoading && !uploadProgress && (
                      <p className="text-sm text-blue-600">Starting upload...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Section */}
              {bulkResult && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Upload Results</h3>
                    <button
                      onClick={resetBulkResults}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear Results
                    </button>
                  </div>

                  {/* Summary */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{bulkResult.summary.successCount}</div>
                      <div className="text-sm text-green-800">Successful</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-red-600">{bulkResult.summary.failedCount}</div>
                      <div className="text-sm text-red-800">Failed</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{bulkResult.summary.totalProcessed}</div>
                      <div className="text-sm text-blue-800">Total Processed</div>
                    </div>
                  </div>

                  {/* Successful Students */}
                  {bulkResult.successful.length > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium text-gray-900">Successfully Added ({bulkResult.successful.length})</h4>
                        <button
                          onClick={exportSuccessfulRecords}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Export Successful
                        </button>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                        {bulkResult.successful.map((student, index) => (
                          <div key={index} className="py-3 border-b border-green-100 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="font-medium">{student.firstName} {student.lastName}</span>
                                  <CheckCircleIcon className="h-4 w-4 text-green-600 ml-2" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Email:</span> {student.email}
                                  </div>
                                  <div>
                                    <span className="font-medium">Reg No:</span> {student.registrationNumber}
                                  </div>
                                  <div>
                                    <span className="font-medium">Program:</span> {student.programName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Batch:</span> {student.batchYear}
                                  </div>
                                  <div>
                                    <span className="font-medium">Semester:</span> {student.semester}
                                  </div>
                                  <div className="md:col-span-2">
                                    <span className="font-medium">Default Password:</span> {student.defaultPassword}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Failed Students */}
                  {bulkResult.failed.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium text-gray-900">Failed to Add ({bulkResult.failed.length})</h4>
                        <button
                          onClick={exportFailedRecords}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Export Failed
                        </button>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                        {bulkResult.failed.map((failed, index) => (
                          <div key={index} className="py-3 border-b border-red-100 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="font-medium">{failed.firstName} {failed.lastName}</span>
                                  <XCircleIcon className="h-4 w-4 text-red-600 ml-2" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Email:</span> {failed.email}
                                  </div>
                                  <div>
                                    <span className="font-medium">Reg No:</span> {failed.registrationNumber}
                                  </div>
                                  <div>
                                    <span className="font-medium">Program:</span> {failed.program}
                                  </div>
                                  <div>
                                    <span className="font-medium">Batch:</span> {failed.batch}
                                  </div>
                                  <div>
                                    <span className="font-medium">Semester:</span> {failed.semester}
                                  </div>
                                </div>
                                <p className="text-sm text-red-600 mt-2 font-medium">{failed.error}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {bulkError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <h3 className="text-sm font-medium text-red-800">
                      {bulkLoading ? "Upload Error" : "Upload Failed"}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-red-600">{bulkError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Result Modal */}
        {resultModal.isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white ${
              resultModal.type === 'success' ? 'max-w-md' : 'max-w-2xl'
            }`}>
              <div className="mt-3 text-center">
                {/* Icon */}
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  resultModal.type === 'success' ? 'bg-green-100' : 
                  resultModal.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {resultModal.type === 'success' ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  ) : resultModal.type === 'error' ? (
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  ) : (
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
                
                {/* Title */}
                <h3 className={`text-lg leading-6 font-medium mt-2 ${
                  resultModal.type === 'success' ? 'text-green-800' : 
                  resultModal.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {resultModal.title}
                </h3>
                
                {/* Message */}
                <div className="mt-2 px-7 py-3">
                  <p className={`text-sm ${
                    resultModal.type === 'success' ? 'text-green-600' : 
                    resultModal.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {resultModal.message}
                  </p>
                  
                  {/* Show failed records if available */}
                  {resultModal.failedRecords && resultModal.failedRecords.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded text-left max-h-60 overflow-y-auto">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Error Details:</h4>
                      {resultModal.failedRecords.map((record, index) => (
                        <div key={index} className="mb-2 p-2 bg-white border border-gray-200 rounded">
                          <p className="text-xs text-gray-600">
                            <strong>Email:</strong> {record.email}<br />
                            <strong>Reg No:</strong> {record.registrationNumber}<br />
                            <strong>Error:</strong> <span className="text-red-600">{record.error}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show additional error details if available */}
                  {resultModal.type === 'error' && resultModal.details && !resultModal.failedRecords && (
                    <div className="mt-3 p-2 bg-red-50 rounded text-left">
                      <p className="text-xs text-red-600">
                        {resultModal.details.error || resultModal.details.message || 'An unexpected error occurred'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Buttons */}
                <div className="items-center px-4 py-3">
                  {resultModal.type === 'success' ? (
                    <>
                      <button
                        onClick={goToStudentsList}
                        className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                      >
                        View All Students
                      </button>
                      <button
                        onClick={closeModal}
                        className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      >
                        Add Another Student
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={closeModal}
                      className={`px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 ${
                        resultModal.type === 'error' 
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                          : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300'
                      }`}
                    >
                      {resultModal.type === 'error' ? 'Try Again' : 'Understand'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}