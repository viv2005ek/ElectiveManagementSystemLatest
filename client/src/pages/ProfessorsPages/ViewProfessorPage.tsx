import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams } from "react-router-dom";
import useFetchProfessorById from "../../hooks/professorHooks/useFetchProfessorById.ts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserIcon, AcademicCapIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function ViewProfessorPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: professor,
    loading,
    error,
  } = useFetchProfessorById(id!);

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
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title="Professor Details" />
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-gray-600" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {professor.firstName} {professor.middleName} {professor.lastName}
                </h1>
                <p className="text-green-100 text-lg">
                  {professor.registrationNumber}
                </p>
                <p className="text-green-200">
                  {professor.email}
                </p>
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
                    <p className="mt-1 text-sm text-gray-900">
                      {professor.professorRank.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Department
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {professor.department.name}
                    </p>
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
                    <p className="mt-1 text-sm text-gray-900">{professor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Registration Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {professor.registrationNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Back
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Edit Professor
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}