import { useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import NumberInputField from "../../components/FormComponents/NumberInputField.tsx";
import useFetchDepartments, {
  Department,
} from "../../hooks/departmentHooks/useFetchDepartments.ts";
import SingleSelectMenuWithSearch from "../../components/FormComponents/SingleSelectMenuWithSearch.tsx";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import useFetchSubjectTypes, {
  SubjectType,
} from "../../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import MultiSelectMenu from "../../components/FormComponents/MultiSelectMenu.tsx";
import useFetchSemesters, {
  Semester,
} from "../../hooks/semesterHooks/useFetchSemesters.ts";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";
import useCreateCourseBulk from "../../hooks/courseHooks/useCreateCourseBulk.ts";

// Add these interfaces
interface ResultModalData {
  isOpen: boolean;
  type: 'success' | 'error' | null;
  title: string;
  message: string;
  details?: any;
}

export default function CreateCoursePage() {
  const { departments } = useFetchDepartments();
  const { subjectTypes } = useFetchSubjectTypes();
  const { semesters } = useFetchSemesters();
  const { notify } = useNotification();

  const { 
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
  } = useCreateCourseBulk({ departments, subjectTypes, semesters });

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credits, setCredits] = useState<number | undefined>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [selectedSubjectTypes, setSelectedSubjectTypes] = useState<SubjectType[]>([]);
  const [semester, setSemester] = useState<Semester | null>(null);

  // Add modal state
  const [resultModal, setResultModal] = useState<ResultModalData>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    details: null
  });

  const handleSubmit = async () => {
    if (!courseName || !courseCode || !credits || !department) {
      notify("error", "Please fill in all required fields.");
      return;
    }

    const courseData = {
      name: courseName,
      code: courseCode,
      credits,
      departmentId: department.id,
      subjectTypeIds: selectedSubjectTypes.map((subjectType) => subjectType.id),
      semesterId: semester?.id,
    };

    console.log("Creating course with data:", courseData);

    try {
      const result = await createCourse(courseData);
      
      // Show success modal
      setResultModal({
        isOpen: true,
        type: 'success',
        title: 'Course Created Successfully',
        message: `Course "${courseData.name}" has been created successfully.`,
        details: result
      });
      
      // Reset form
      setCourseCode("");
      setCourseName("");
      setCredits(undefined);
      setDepartment(null);
      setSelectedSubjectTypes([]);
      setSemester(null);
      
    } catch (error: any) {
      console.error("Failed to create course:", error);
      
      // Show error modal
      setResultModal({
        isOpen: true,
        type: 'error',
        title: 'Failed to Create Course',
        message: error.response?.data?.message || error.message || 'An unexpected error occurred',
        details: error.response?.data
      });
    }
  };

  // Close modal function
  const closeModal = () => {
    setResultModal({
      isOpen: false,
      type: null,
      title: '',
      message: '',
      details: null
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="Create Course" />
        
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("single")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "single"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Single Course
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bulk"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Bulk Upload
            </button>
          </nav>
        </div>

        {/* Single Course Form */}
        {activeTab === "single" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Course Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the details to create a new course.
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <TextInputField
                    value={courseName}
                    setValue={setCourseName}
                    label="Course name *"
                    placeholder="Enter course name"
                  />
                </div>
                <div>
                  <TextInputField
                    value={courseCode}
                    setValue={setCourseCode}
                    label="Course code *"
                    placeholder="Enter course code"
                  />
                </div>
                <div>
                  <NumberInputField
                    value={credits}
                    setValue={setCredits}
                    label="Credits *"
                    placeholder="Enter credits"
                  />
                </div>
                <div>
                  <SingleSelectMenuWithSearch
                    items={departments}
                    selected={department}
                    setSelected={setDepartment}
                    label="Department *"
                  />
                </div>
                <div>
                  <MultiSelectMenu
                    label="Subject Types"
                    items={subjectTypes}
                    selected={selectedSubjectTypes}
                    setSelected={setSelectedSubjectTypes}
                  />
                </div>
                <div>
                  <SingleSelectMenu
                    label="Semester"
                    prefix="Semester"
                    items={semesters}
                    selected={semester}
                    setSelected={setSemester}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    Error: {error}
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Section */}
        {activeTab === "bulk" && (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Upload Courses</h3>
              
              {/* Download Template */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Download Template</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Use our CSV template with department names and semester numbers (no IDs needed).
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    disabled={bulkLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {bulkLoading ? "Loading..." : "Download Template"}
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              {uploadProgress && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Processing... ({uploadProgress.processed}/{uploadProgress.total})
                    </h4>
                    <span className="text-sm text-yellow-600">
                      {Math.round((uploadProgress.processed / uploadProgress.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(uploadProgress.processed / uploadProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  {uploadProgress.currentRecord && (
                    <p className="text-sm text-yellow-700 mt-2">
                      Currently processing: {uploadProgress.currentRecord.name} ({uploadProgress.currentRecord.code})
                    </p>
                  )}
                  <div className="mt-3">
                    <button
                      onClick={cancelBulkUpload}
                      className="text-sm text-yellow-700 hover:text-yellow-800 underline"
                    >
                      Cancel Upload
                    </button>
                  </div>
                </div>
              )}

              {/* Available Data Info */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Available Departments</h4>
                  <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                    {departments.map(dept => (
                      <div key={dept.id} className="py-1">
                        {dept.name} 
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Available Subject Types</h4>
                  <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                    {subjectTypes.map(type => (
                      <div key={type.id} className="py-1">
                        {type.name} 
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Available Semesters</h4>
                  <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                    {semesters.map(sem => (
                      <div key={sem.id} className="py-1">
                        Semester {sem.number}
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
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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

                {/* Successful Courses */}
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
                      {bulkResult.successful.map((course, index) => (
                        <div key={index} className="py-3 border-b border-green-100 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium">{course.name}</span>
                                <span className="text-sm text-green-600 ml-2">✓</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Code:</span> {course.code}
                                </div>
                                <div>
                                  <span className="font-medium">Credits:</span> {course.credits}
                                </div>
                                <div>
                                  <span className="font-medium">Department:</span> {course.departmentName}
                                </div>
                                <div>
                                  <span className="font-medium">Subject Types:</span> {course.subjectTypeNames.join(', ') || 'None'}
                                </div>
                                {course.semesterName && (
                                  <div className="md:col-span-2">
                                    <span className="font-medium">Semester:</span> {course.semesterName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failed Courses */}
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
                                <span className="font-medium">{failed.name}</span>
                                <span className="text-sm text-red-600 ml-2">✗</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Code:</span> {failed.code}
                                </div>
                                <div>
                                  <span className="font-medium">Credits:</span> {failed.credits}
                                </div>
                                <div>
                                  <span className="font-medium">Department:</span> {failed.department}
                                </div>
                                <div>
                                  <span className="font-medium">Subject Types:</span> {failed.subjectTypes || 'None'}
                                </div>
                                {failed.semester && (
                                  <div>
                                    <span className="font-medium">Semester:</span> {failed.semester}
                                  </div>
                                )}
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
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-red-800">
                    {bulkLoading ? "Upload Error" : "Upload Failed"}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Result Modal */}
        {resultModal.isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                {/* Icon */}
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  resultModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {resultModal.type === 'success' ? (
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                </div>
                
                {/* Title */}
                <h3 className={`text-lg leading-6 font-medium ${
                  resultModal.type === 'success' ? 'text-green-800' : 'text-red-800'
                } mt-2`}>
                  {resultModal.title}
                </h3>
                
                {/* Message */}
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    {resultModal.message}
                  </p>
                  
                  {/* Show failed details if available */}
                  {resultModal.type === 'error' && resultModal.details?.failed && (
                    <div className="mt-3 p-2 bg-red-50 rounded text-left">
                      <p className="text-xs text-red-600 font-medium">
                        {resultModal.details.failed[0]?.error || 'Please check the form and try again.'}
                      </p>
                    </div>
                  )}
                  
                  {/* Show successful details if available */}
                  {resultModal.type === 'success' && resultModal.details?.successful && (
                    <div className="mt-3 p-2 bg-green-50 rounded text-left">
                      <p className="text-xs text-green-600">
                        Course Code: {resultModal.details.successful[0]?.code}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Buttons */}
                <div className="items-center px-4 py-3">
                  <button
                    onClick={closeModal}
                    className={`px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 ${
                      resultModal.type === 'success' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300' 
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                    }`}
                  >
                    {resultModal.type === 'success' ? 'Add Another Course' : 'Try Again'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}