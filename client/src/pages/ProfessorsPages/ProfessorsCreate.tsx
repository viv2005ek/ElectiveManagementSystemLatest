import { useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useNavigate } from "react-router-dom";
import useCreateProfessor from "../../hooks/professorHooks/useCreateProfessor.ts";
import useFetchDepartments from "../../hooks/departmentHooks/useFetchDepartments.ts";
import useFetchProfessorRanks from "../../hooks/professorHooks/useFetchProfessorRanks.ts";

// Add these interfaces
interface ResultModalData {
  isOpen: boolean;
  type: 'success' | 'error' | null;
  title: string;
  message: string;
  details?: any;
}

export default function ProfessorsCreate() {
  const navigate = useNavigate();
  const { departments, loading: departmentsLoading } = useFetchDepartments();
  const { professorRanks, loading: ranksLoading } = useFetchProfessorRanks();
  
  const { 
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
  } = useCreateProfessor({ departments, professorRanks });
  
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    registrationNumber: "",
    departmentId: "",
    professorRankId: "",
    password: "" 
  });

  // Add modal state
  const [resultModal, setResultModal] = useState<ResultModalData>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    details: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createProfessor(formData);
      
      // Show success modal
      setResultModal({
        isOpen: true,
        type: 'success',
        title: 'Professor Created Successfully',
        message: `Professor ${formData.firstName} ${formData.lastName} has been created successfully.`,
        details: result
      });
      
      // Reset form
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        registrationNumber: "",
        departmentId: "",
        professorRankId: "",
        password: "" 
      });
      
    } catch (error: any) {
      console.error("Failed to create professor:", error);
      
      // Show error modal
      setResultModal({
        isOpen: true,
        type: 'error',
        title: 'Failed to Create Professor',
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

  // Navigate to professors list
  const goToProfessorsList = () => {
    navigate("/professors");
  };

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title="Add New Professor" />
        
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
              Single Professor
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

        {/* Single Professor Form */}
        {activeTab === "single" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password for professor"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Set a secure password for the professor account
                    </p>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                      Department *
                    </label>
                    <select
                      id="departmentId"
                      name="departmentId"
                      required
                      value={formData.departmentId}
                      onChange={handleChange}
                      disabled={departmentsLoading}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} - {dept.school.name}
                        </option>
                      ))}
                    </select>
                    {departmentsLoading && (
                      <p className="mt-1 text-sm text-gray-500">Loading departments...</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="professorRankId" className="block text-sm font-medium text-gray-700">
                      Professor Rank *
                    </label>
                    <select
                      id="professorRankId"
                      name="professorRankId"
                      required
                      value={formData.professorRankId}
                      onChange={handleChange}
                      disabled={ranksLoading}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="">Select Rank</option>
                      {professorRanks.map((rank) => (
                        <option key={rank.id} value={rank.id}>
                          {rank.name} (Priority: {rank.priority})
                        </option>
                      ))}
                    </select>
                    {ranksLoading && (
                      <p className="mt-1 text-sm text-gray-500">Loading professor ranks...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/professors")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Professor"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Upload Professors</h3>
              
              {/* Download Template */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Download Template</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Use our CSV template with department and rank names (no IDs needed).
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    disabled={departmentsLoading || ranksLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {departmentsLoading || ranksLoading ? "Loading..." : "Download Template"}
                  </button>
                </div>
                {(departmentsLoading || ranksLoading) && (
                  <p className="mt-2 text-sm text-blue-600">
                    Loading available departments and ranks for template...
                  </p>
                )}
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
                      Currently processing: {uploadProgress.currentRecord.firstName} {uploadProgress.currentRecord.lastName} ({uploadProgress.currentRecord.email})
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

              {/* Available Departments & Ranks Info */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Available Ranks</h4>
                  <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                    {professorRanks.map(rank => (
                      <div key={rank.id} className="py-1">
                        {rank.name} 
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

                {/* Successful Professors */}
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
                      {bulkResult.successful.map((prof, index) => (
                        <div key={index} className="py-3 border-b border-green-100 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium">{prof.firstName} {prof.middleName} {prof.lastName}</span>
                                <span className="text-sm text-green-600 ml-2">✓</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Email:</span> {prof.email}
                                </div>
                                <div>
                                  <span className="font-medium">Reg No:</span> {prof.registrationNumber}
                                </div>
                                <div>
                                  <span className="font-medium">Department:</span> {prof.departmentName}
                                </div>
                                <div>
                                  <span className="font-medium">Rank:</span> {prof.professorRankName}
                                </div>
                                <div className="md:col-span-2">
                                  <span className="font-medium">Default Password:</span> {prof.defaultPassword}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failed Professors */}
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
                                <span className="font-medium">{failed.firstName} {failed.middleName} {failed.lastName}</span>
                                <span className="text-sm text-red-600 ml-2">✗</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Email:</span> {failed.email}
                                </div>
                                <div>
                                  <span className="font-medium">Reg No:</span> {failed.registrationNumber}
                                </div>
                                <div>
                                  <span className="font-medium">Department:</span> {failed.department}
                                </div>
                                <div>
                                  <span className="font-medium">Rank:</span> {failed.professorRank}
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
                        Registration Number: {resultModal.details.successful[0]?.registrationNumber}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Buttons */}
                <div className="items-center px-4 py-3">
                  {resultModal.type === 'success' ? (
                    <button
                      onClick={goToProfessorsList}
                      className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      View All Professors
                    </button>
                  ) : (
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Try Again
                    </button>
                  )}
                  
                  {resultModal.type === 'success' && (
                    <button
                      onClick={closeModal}
                      className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Add Another Professor
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