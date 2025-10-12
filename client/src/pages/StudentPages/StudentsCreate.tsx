import { useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useNavigate } from "react-router-dom";
import useCreateStudent from "../../hooks/studentHooks/useCreateStudent.ts";
import useBulkAddStudents from "../../hooks/studentHooks/useBulkAddStudents.ts";
import {useFetchPrograms} from "../../hooks/programHooks/useFetchPrograms.ts";
import useFetchBatches from "../../hooks/batchHooks/useFetchBatches.ts";
import { DocumentArrowUpIcon, DocumentTextIcon, UserPlusIcon } from "@heroicons/react/24/outline";

interface StudentData {
  firstName: string;
  lastName: string;
  gender: string;
  contactNumber: string;
  registrationNumber: string;
  semester: number;
  batchId: string;
  email: string;
  programId: string;
  password: string;
}

export default function StudentsCreate() {
  const navigate = useNavigate();
  const { createStudent, loading: singleLoading } = useCreateStudent();
  const { bulkAddStudents, loading: bulkLoading } = useBulkAddStudents();
  const { programs, loading: programsLoading } = useFetchPrograms();
  const { batches, loading: batchesLoading } = useFetchBatches();
  
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  
  // Single Student Form State
  const [singleForm, setSingleForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    registrationNumber: "",
    contactNumber: "",
    gender: "MALE",
    semester: "",
    programId: "",
    batchId: "",
    password: "password123"
  });

  // Bulk Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Helper function to find ID by name
  const findProgramIdByName = (programName: string): string => {
    const program = programs.find(p => 
      p.name.toLowerCase() === programName.toLowerCase() ||
      p.name.toLowerCase().includes(programName.toLowerCase())
    );
    return program?.id || "";
  };

  const findBatchIdByYear = (batchYear: string): string => {
    const batch = batches.find(b => 
      b.year.toString() === batchYear.trim()
    );
    return batch?.id || "";
  };

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
      await createStudent(singleForm);
      navigate("/students");
    } catch (error) {
      console.error("Failed to create student:", error);
    }
  };

  // Bulk Upload Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setErrors(['Please upload a valid CSV file']);
      return;
    }

    setCsvFile(file);
    setErrors([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedStudents = parseCSV(csvText);
        setStudents(parsedStudents);
      } catch (error) {
        setErrors([error instanceof Error ? error.message : 'Error parsing CSV file']);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string): StudentData[] => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    // Validate required columns
    const requiredColumns = ['firstname', 'lastname', 'gender', 'registrationnumber', 'semester', 'email', 'program', 'batch'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    const students: StudentData[] = [];
    const rowErrors: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      
      const programName = values[headers.indexOf('program')] || '';
      const batchYear = values[headers.indexOf('batch')] || '';
      
      const programId = findProgramIdByName(programName);
      const batchId = findBatchIdByYear(batchYear);

      if (!programId) {
        rowErrors.push(`Row ${i + 1}: Program "${programName}" not found`);
      }
      if (!batchId) {
        rowErrors.push(`Row ${i + 1}: Batch "${batchYear}" not found`);
      }

      const student: StudentData = {
        firstName: values[headers.indexOf('firstname')] || '',
        lastName: values[headers.indexOf('lastname')] || '',
        gender: (values[headers.indexOf('gender')] || 'MALE').toUpperCase(),
        contactNumber: values[headers.indexOf('contactnumber')] || '',
        registrationNumber: values[headers.indexOf('registrationnumber')] || '',
        semester: parseInt(values[headers.indexOf('semester')]) || 1,
        batchId: batchId,
        email: values[headers.indexOf('email')] || '',
        programId: programId,
        password: 'password123'
      };

      // Validate required fields
      if (!student.firstName || !student.lastName || !student.registrationNumber || !student.email) {
        rowErrors.push(`Row ${i + 1}: Missing required fields`);
      }

      if (!programId || !batchId) {
        continue; // Skip rows with invalid program/batch
      }

      students.push(student);
    }

    if (rowErrors.length > 0) {
      setErrors(rowErrors);
    }

    return students;
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (students.length === 0) {
      setErrors(['No valid student data to upload']);
      return;
    }

    try {
      await bulkAddStudents({ students });
      navigate("/students");
    } catch (error: any) {
      console.error("Failed to create students:", error);
      setErrors([error.response?.data?.message || "Failed to upload students"]);
    }
  };

  const downloadTemplate = () => {
    const availablePrograms = programs.map(p => p.name).join(' / ');
    const availableBatches = batches.map(b => b.year).join(' / ');
    
    const headers = ['firstName', 'lastName', 'gender', 'contactNumber', 'registrationNumber', 'semester', 'email', 'program', 'batch'];
    const exampleRow = [
      'John',
      'Doe', 
      'MALE',
      '1234567890',
      'REG001',
      '1',
      'john.doe@university.edu',
      `Available: ${availablePrograms}`,
      `Available: ${availableBatches}`
    ];
    
    const template = [headers.join(','), exampleRow.join(',')].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const loading = singleLoading || bulkLoading;

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title="Add Students" />

        {/* Available Programs and Batches Info */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Available Programs & Batches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Programs:</span>
              <span className="text-blue-600 ml-2">
                {programs.map(p => p.name).join(', ')}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Batches:</span>
              <span className="text-blue-600 ml-2">
                {batches.map(b => b.year).join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("single")}
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
                onClick={() => setActiveTab("bulk")}
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

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Single Student Form */}
          {activeTab === "single" && (
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
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
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
                    />
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
                    />
                  </div>

                  <div>
                    <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                      Semester *
                    </label>
                    <input
                      type="number"
                      id="semester"
                      name="semester"
                      required
                      min="1"
                      max="12"
                      value={singleForm.semester}
                      onChange={handleSingleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
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
                          {program.name} - {program.department.name}
                        </option>
                      ))}
                    </select>
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
                  disabled={loading || programsLoading || batchesLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Student"}
                </button>
              </div>
            </form>
          )}

          {/* Bulk Upload Form */}
          {activeTab === "bulk" && (
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Bulk Upload Students</h3>
                
                {/* Template Download */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Download CSV Template</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Use exact program names and batch years from the list above.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={downloadTemplate}
                      className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <DocumentTextIcon className="w-4 h-4 mr-2" />
                      Download Template
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="csv-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a CSV file</span>
                          <input
                            id="csv-upload"
                            name="csv-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV files only. Use exact program names and batch years.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-800">Errors Found:</h4>
                    <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preview */}
                {students.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">
                      Preview ({students.length} valid students found)
                    </h4>
                    <div className="max-h-60 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reg No.</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.slice(0, 10).map((student, index) => {
                            const program = programs.find(p => p.id === student.programId);
                            const batch = batches.find(b => b.id === student.batchId);
                            return (
                              <tr key={index}>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {student.firstName} {student.lastName}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">{student.email}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{student.registrationNumber}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{student.semester}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{program?.name}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{batch?.year}</td>
                              </tr>
                            );
                          })}
                          {students.length > 10 && (
                            <tr>
                              <td colSpan={6} className="px-3 py-2 text-sm text-gray-500 text-center">
                                ... and {students.length - 10} more students
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
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
                  disabled={loading || students.length === 0}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Uploading..." : `Upload ${students.length} Students`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}