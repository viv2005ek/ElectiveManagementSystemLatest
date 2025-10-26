// ViewStudentPage.tsx (Updated - only showing the changed parts)
import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams, useNavigate } from "react-router-dom";
import useFetchStudentById from "../../hooks/studentHooks/useFetchStudentById.ts";
import useDeleteStudent from "../../hooks/studentHooks/useDeleteStudent.ts";
import useUpdateStudent from "../../hooks/studentHooks/useUpdateStudent.ts";
import { useFetchPrograms } from "../../hooks/programHooks/useFetchPrograms.ts";
import useFetchBatches from "../../hooks/batchHooks/useFetchBatches.ts";
import useFetchSemesters from "../../hooks/semesterHooks/useFetchSemesters.ts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { 
  UserIcon, 
  AcademicCapIcon, 
  BuildingOfficeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

// Modal interfaces
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

interface EditFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  gender: string;
  semester: string;
  programId: string;
  batchId: string;
}

export default function ViewStudentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: student,
    loading,
    error,
  } = useFetchStudentById(id!);
  
  const { deleteStudent, loading: deleting } = useDeleteStudent();
  const { updateStudent, loading: updating, error: updateError, detailedError } = useUpdateStudent();
  const { programs, loading: programsLoading } = useFetchPrograms();
  const { batches, loading: batchesLoading } = useFetchBatches();
  const { semesters, loading: semestersLoading } = useFetchSemesters();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    gender: "Male",
    semester: "",
    programId: "",
    batchId: ""
  });

  // Result modal state
  const [resultModal, setResultModal] = useState<ResultModalData>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    details: null
  });

  // Initialize edit form when student data loads
  useEffect(() => {
    if (student) {
      setEditForm({
        firstName: student.firstName,
        middleName: student.middleName || "",
        lastName: student.lastName,
        email: student.email,
        contactNumber: student.contactNumber || "",
        gender: student.gender,
        semester: student.semester.toString(),
        programId: student.programId,
        batchId: student.batchId
      });
    }
  }, [student]);

  // Show error modal when updateError or detailedError changes
  useEffect(() => {
    if (updateError && detailedError) {
      showResultModal(
        'error', 
        'Update Failed', 
        detailedError.message || updateError,
        detailedError,
        detailedError.failed
      );
    } else if (updateError) {
      showResultModal(
        'error', 
        'Update Failed', 
        updateError
      );
    }
  }, [updateError, detailedError]);

  const showResultModal = (
    type: 'success' | 'error' | 'warning', 
    title: string, 
    message: string, 
    details?: any,
    failedRecords?: Array<{ email: string; registrationNumber: string; error: string }>
  ) => {
    setResultModal({
      isOpen: true,
      type,
      title,
      message,
      details,
      failedRecords
    });
  };

  const closeResultModal = () => {
    setResultModal({
      isOpen: false,
      type: null,
      title: '',
      message: '',
      details: null
    });
  };

  const handleDelete = async () => {
    if (!student) return;
    
    try {
      await deleteStudent(student.id);
      showResultModal(
        'success', 
        'Delete Successful', 
        `Student ${student.firstName} ${student.lastName} has been deleted successfully.`
      );
      setTimeout(() => {
        navigate("/students");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to delete student:", error);
      showResultModal(
        'error', 
        'Delete Failed', 
        error.response?.data?.message || error.response?.data?.error || 'Failed to delete student'
      );
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!student) return;
    
    try {
      // Validate required fields
      const validationErrors = validateEditForm(editForm);
      if (validationErrors.length > 0) {
        showResultModal(
          'error', 
          'Validation Error', 
          'Please fix the following errors:',
          null,
          validationErrors.map(error => ({
            email: editForm.email || student.email,
            registrationNumber: student.registrationNumber,
            error: error
          }))
        );
        return;
      }

      const result = await updateStudent(student.id, {
        ...editForm,
        semester: parseInt(editForm.semester)
      });
      
      showResultModal(
        'success', 
        'Update Successful', 
        `Student ${editForm.firstName} ${editForm.lastName} has been updated successfully.`,
        result
      );
      setIsEditing(false);
      
      // Refresh the page after a short delay to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      // Error is handled by the useEffect above
      console.error("Update error caught in handleSave:", error);
    }
  };

  const validateEditForm = (formData: EditFormData): string[] => {
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) errors.push("First name is required");
    if (!formData.lastName.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.semester) errors.push("Semester is required");
    if (!formData.programId) errors.push("Program is required");
    if (!formData.batchId) errors.push("Batch is required");
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }
    
    // Semester validation
    const semesterNum = parseInt(formData.semester);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 12) {
      errors.push("Semester must be a number between 1 and 12");
    }
    
    return errors;
  };

  const handleCancel = () => {
    if (student) {
      setEditForm({
        firstName: student.firstName,
        middleName: student.middleName || "",
        lastName: student.lastName,
        email: student.email,
        contactNumber: student.contactNumber || "",
        gender: student.gender,
        semester: student.semester.toString(),
        programId: student.programId,
        batchId: student.batchId
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="py-8">
          <PageHeader title="Loading..." />
          <div className="bg-white shadow-md rounded-lg p-8 mt-8">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <Skeleton height={24} width={200} />
                  <Skeleton height={16} width={150} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton height={16} width={100} />
                    <Skeleton height={40} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !student) {
    return (
      <MainLayout>
        <div className="py-8">
          <PageHeader title="Error" />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
            <p className="text-red-600">
              {error || "Student not found"}
            </p>
            <button
              onClick={() => navigate("/students")}
              className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Students
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title={isEditing ? "Edit Student" : "Student Details"} />
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-gray-600" />
                </div>
                <div className="text-white">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleEditChange}
                        className="text-2xl font-bold bg-white/20 rounded px-2 py-1 text-white placeholder-blue-200 border border-white/30 focus:border-white focus:outline-none"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="middleName"
                        value={editForm.middleName}
                        onChange={handleEditChange}
                        className="text-lg bg-white/20 rounded px-2 py-1 text-white placeholder-blue-200 border border-white/30 focus:border-white focus:outline-none"
                        placeholder="Middle Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditChange}
                        className="text-2xl font-bold bg-white/20 rounded px-2 py-1 text-white placeholder-blue-200 border border-white/30 focus:border-white focus:outline-none"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">
                        {student.firstName} {student.middleName} {student.lastName}
                      </h1>
                      <p className="text-blue-100 text-lg">
                        {student.registrationNumber}
                      </p>
                      <p className="text-blue-200">
                        {student.email}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={updating}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 transition-colors"
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      {updating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updating}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={deleting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Gender
                    </label>
                    {isEditing ? (
                     <select
  name="gender"
  value={editForm.gender}
  onChange={handleEditChange}
  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
</select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{student.gender}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="contactNumber"
                        value={editForm.contactNumber}
                        onChange={handleEditChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{student.contactNumber}</p>
                    )}
                  </div>
                  {(student as any).cgpa && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        CGPA
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{(student as any).cgpa}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-green-600" />
                  Academic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Program
                    </label>
                    {isEditing ? (
                      <select
                        name="programId"
                        value={editForm.programId}
                        onChange={handleEditChange}
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
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{student.program.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Semester
                    </label>
                    {isEditing ? (
                      <select
                        name="semester"
                        value={editForm.semester}
                        onChange={handleEditChange}
                        disabled={semestersLoading}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="">Select Semester</option>
                        {semesters.map((semester) => (
                          <option key={semester.id} value={semester.number}>
                            Semester {semester.number}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">Semester {student.semester}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Batch
                    </label>
                    {isEditing ? (
                      <select
                        name="batchId"
                        value={editForm.batchId}
                        onChange={handleEditChange}
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
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{student.batch.year}</p>
                    )}
                  </div>
                  {(student as any).section && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Section
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{(student as any).section?.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{student.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Registration Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {student.registrationNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Department
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {student.program.department.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      School
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {student.program.department.school.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => navigate("/students")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back to List
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Edit Student
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                  Delete Student
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete {student.firstName} {student.lastName}? 
                    This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Modal for Success/Error */}
       {resultModal.isOpen && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className={`relative top-20 mx-auto p-5 border shadow-lg rounded-md bg-white ${
        resultModal.type === 'success' ? 'max-w-md' : 'max-w-2xl'
      }`}>
        <div className="mt-3 text-center">
          {/* Icon */}
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
            resultModal.type === 'success' ? 'bg-green-100' : 
            resultModal.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            {resultModal.type === 'success' ? (
              <CheckIcon className="h-6 w-6 text-green-600" />
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
            
            {/* Show failed records with detailed errors */}
            {resultModal.failedRecords && resultModal.failedRecords.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left max-h-60 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-red-500" />
                  Error Details:
                </h4>
                <div className="space-y-2">
                  {resultModal.failedRecords.map((record, index) => (
                    <div key={index} className="p-3 bg-white border border-red-200 rounded-md">
                      <div className="flex items-start">
                        <XCircleIcon className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {editForm.email} ({record.registrationNumber || 'No registration number'})
                          </p>
                          <p className="text-sm text-red-600 mt-1">{record.error}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show summary if available */}
           
          </div>
          
          {/* Buttons */}
          <div className="items-center px-4 py-3">
            {resultModal.type === 'success' ? (
              <button
                onClick={closeResultModal}
                className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
              >
                OK
              </button>
            ) : (
              <button
                onClick={closeResultModal}
                className={`px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 ${
                  resultModal.type === 'error' 
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                    : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300'
                } transition-colors`}
              >
                {resultModal.type === 'error' ? 'Understand & Try Again' : 'OK'}
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