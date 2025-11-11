import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams, useNavigate } from "react-router-dom";
import useFetchProfessorById from "../../hooks/professorHooks/useFetchProfessorById.ts";
import useDeleteProfessor from "../../hooks/professorHooks/useDeleteProfessor.ts";
import useUpdateProfessor from "../../hooks/professorHooks/useUpdateProfessor.ts";
import useFetchDepartments from "../../hooks/departmentHooks/useFetchDepartments.ts";
import Skeleton from "react-loading-skeleton";
import useFetchProfessorRanks from "../../hooks/professorHooks/useFetchProfessorRanks.ts";
import "react-loading-skeleton/dist/skeleton.css";
import { 
  UserIcon, 
  AcademicCapIcon, 
  BuildingOfficeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon 
} from "@heroicons/react/24/outline";

// Add modal interface
interface ResultModalData {
  isOpen: boolean;
  type: 'success' | 'error' | null;
  title: string;
  message: string;
  details?: any;
}

export default function ViewProfessorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: professor,
    loading,
    error,
  } = useFetchProfessorById(id!);
  
  const { deleteProfessor, loading: deleting } = useDeleteProfessor();
  const { updateProfessor, loading: updating, error: updateError } = useUpdateProfessor();
  const { departments, loading: departmentsLoading } = useFetchDepartments();
  const { professorRanks, loading: ranksLoading } = useFetchProfessorRanks();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    departmentId: "",
    professorRankId: ""
  });

  // Add modal state
  const [resultModal, setResultModal] = useState<ResultModalData>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    details: null
  });

  // Initialize edit form when professor data loads
  useEffect(() => {
    if (professor) {
      setEditForm({
        firstName: professor.firstName,
        middleName: professor.middleName || "",
        lastName: professor.lastName,
        email: professor.email,
        departmentId: professor.departmentId,
        professorRankId: professor.professorRankId.toString()
      });
    }
  }, [professor]);

  const handleDelete = async () => {
    if (!professor) return;
    
    try {
      await deleteProfessor(professor.id);
      navigate("/professors");
    } catch (error) {
      console.error("Failed to delete professor:", error);
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
    if (!professor) return;
    
    try {
      const result = await updateProfessor(professor.id, editForm);
      
      // Show success modal
      setResultModal({
        isOpen: true,
        type: 'success',
        title: 'Update Successful',
        message: `Professor ${editForm.firstName} ${editForm.lastName} has been updated successfully.`,
        details: result
      });
      
      setIsEditing(false);

    } catch (error: any) {
      console.error("Failed to update professor:", error);
      
      // Show error modal with detailed error information
      const errorDetails = error.response?.data;
      
      setResultModal({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: errorDetails?.message || 'Failed to update professor',
        details: errorDetails
      });
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (professor) {
      setEditForm({
        firstName: professor.firstName,
        middleName: professor.middleName || "",
        lastName: professor.lastName,
        email: professor.email,
        departmentId: professor.departmentId,
        professorRankId: professor.professorRankId.toString()
      });
    }
    setIsEditing(false);
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
    
    // If it was a success modal and we're not editing anymore, refresh the page
    if (resultModal.type === 'success' && !isEditing) {
      window.location.reload(); // Simple refresh to show updated data
    }
  };

  // Navigate to professors list
  const goToProfessorsList = () => {
    navigate("/professors");
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
                {Array.from({ length: 6 }).map((_, i) => (
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

  if (error || !professor) {
    return (
      <MainLayout>
        <div className="py-8">
          <PageHeader title="Error" />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
            <p className="text-red-600">
              {error || "Professor not found"}
            </p>
            <button
              onClick={() => navigate("/professors")}
              className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Professors
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title={isEditing ? "Edit Professor" : "Professor Details"} />
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
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
                        className="text-2xl font-bold bg-white/20 rounded px-2 py-1 text-white placeholder-green-200"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="middleName"
                        value={editForm.middleName}
                        onChange={handleEditChange}
                        className="text-lg bg-white/20 rounded px-2 py-1 text-white placeholder-green-200"
                        placeholder="Middle Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditChange}
                        className="text-2xl font-bold bg-white/20 rounded px-2 py-1 text-white placeholder-green-200"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">
                        {professor.firstName} {professor.middleName} {professor.lastName}
                      </h1>
                      <p className="text-green-100 text-lg">
                        {professor.registrationNumber}
                      </p>
                      <p className="text-green-200">
                        {professor.email}
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
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50"
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      {updating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={deleting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-green-600" />
                  Professional Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Professor Rank
                    </label>
                    {isEditing ? (
                      <select
                        name="professorRankId"
                        value={editForm.professorRankId}
                        onChange={handleEditChange}
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
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {professor.professorRank.name} (Priority: {professor.professorRank.priority})
                      </p>
                    )}
                    {ranksLoading && isEditing && (
                      <p className="mt-1 text-sm text-gray-500">Loading professor ranks...</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Department
                    </label>
                    {isEditing ? (
                      <select
                        name="departmentId"
                        value={editForm.departmentId}
                        onChange={handleEditChange}
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
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {professor.department.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      School
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {professor.department.school.name}
                    </p>
                  </div>
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
                      <p className="mt-1 text-sm text-gray-900">{professor.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Employee ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {professor.registrationNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => navigate("/professors")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Back to List
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Edit Professor
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
                  Delete Professor
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete {professor.firstName} {professor.lastName}? 
                    This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Modal for Edit Success/Error */}
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
                  
                  {/* Show summary if available */}
               
                  
                  {/* Show individual error if available */}
                  {resultModal.type === 'error' && resultModal.details?.error && (
                    <div className="mt-3 p-2 bg-red-50 rounded text-left">
                      <p className="text-xs text-red-600 font-medium">
                        {resultModal.details.error}
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
                      onClick={closeModal}
                      className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      OK
                    </button>
                  ) : (
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Try Again
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