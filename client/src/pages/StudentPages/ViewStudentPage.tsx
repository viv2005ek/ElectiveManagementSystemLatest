import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams } from "react-router-dom";
import useFetchStudentById from "../../hooks/studentHooks/useFetchStudentById.ts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserIcon, AcademicCapIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function ViewStudentPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: student,
    loading,
    error,
  } = useFetchStudentById(id!);

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
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title="Student Details" />
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-gray-600" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {student.firstName} {student.middleName} {student.lastName}
                </h1>
                <p className="text-blue-100 text-lg">
                  {student.registrationNumber}
                </p>
                <p className="text-blue-200">
                  {student.email}
                </p>
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
                    <p className="mt-1 text-sm text-gray-900">{student.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Contact Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{student.contactNumber}</p>
                  </div>
                  {student.cgpa && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        CGPA
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{student.cgpa}</p>
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
                    <p className="mt-1 text-sm text-gray-900">{student.program.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Semester
                    </label>
                    <p className="mt-1 text-sm text-gray-900">Semester {student.semester}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Batch
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{student.batch.year}</p>
                  </div>
                  {student.section && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Section
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{student.section.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Department Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Department Information
                </h3>
                <div className="space-y-3">
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
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}