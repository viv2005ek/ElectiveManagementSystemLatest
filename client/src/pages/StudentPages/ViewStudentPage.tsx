import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams, useNavigate } from "react-router-dom";
import useFetchStudentById from "../../hooks/studentHooks/useFetchStudentById.ts";
import useDeleteStudent from "../../hooks/studentHooks/useDeleteStudent.ts";
import useUpdateStudent from "../../hooks/studentHooks/useUpdateStudent.ts";
import {useFetchPrograms} from "../../hooks/programHooks/useFetchPrograms.ts";
import useFetchBatches from "../../hooks/batchHooks/useFetchBatches.ts";
import Skeleton from "react-loading-skeleton";
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

export default function ViewStudentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: student,
    loading,
    error,
  } = useFetchStudentById(id!);
  
  const { deleteStudent, loading: deleting } = useDeleteStudent();
  const { updateStudent, loading: updating } = useUpdateStudent();
  const { programs, loading: programsLoading } = useFetchPrograms();
  const { batches, loading: batchesLoading } = useFetchBatches();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    gender: "MALE",
    semester: "",
    programId: "",
    batchId: ""
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

  const handleDelete = async () => {
    if (!student) return;
    
    try {
      await deleteStudent(student.id);
      navigate("/students");
    } catch (error) {
      console.error("Failed to delete student:", error);
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
      await updateStudent(student.id, {
        ...editForm,
        semester: parseInt(editForm.semester)
      });
      setIsEditing(false);
      alert("Student updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update student:", error);
    }
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
                        className="text-2xl font-bold bg-white/20 rounded px-2 py-1 text-white placeholder-blue-200"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="middleName"
                        value={editForm.middleName}
                        onChange={handleEditChange}
                        className="text-lg bg-white/20 rounded px-2 py-1 text-white placeholder-blue-200"
                        placeholder="Middle Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditChange}
                        className="text-2xl font-bold bg-white/20 rounded px-2 py-1 text-white placeholder-blue-200"
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
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50"
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
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
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
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
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
                      <input
                        type="number"
                        name="semester"
                        value={editForm.semester}
                        onChange={handleEditChange}
                        min="1"
                        max="12"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to List
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
      </div>
    </MainLayout>
  );
}