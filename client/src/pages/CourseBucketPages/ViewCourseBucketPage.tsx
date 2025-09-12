import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams } from "react-router-dom";
import useFetchCourseBucketById from "../../hooks/courseBucketHooks/useFetchCourseBucketById.ts";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ViewCourseBucketPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: courseBucket,
    loading,
    error,
  } = useFetchCourseBucketById(id!);

  if (loading) {
    return (
      <MainLayout>
        <div className="py-8">
          <PageHeader title="Loading..." />
          <div className="bg-white shadow-md rounded-lg p-8 mt-8">
            <div className="animate-pulse space-y-4">
              <Skeleton height={40} />
              <Skeleton height={20} count={3} />
              <Skeleton height={100} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !courseBucket) {
    return (
      <MainLayout>
        <div className="py-8">
          <PageHeader title="Error" />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
            <p className="text-red-600">
              {error || "Course bucket not found"}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title="View Course Bucket" />
        
        <div className="bg-white shadow-md rounded-lg p-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Bucket Name
              </label>
              <p className="p-3 border rounded-lg text-sm bg-gray-50">
                {courseBucket.name}
              </p>
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Department
              </label>
              <p className="p-3 border rounded-lg text-sm bg-gray-50">
                {courseBucket.department?.name || "N/A"}
              </p>
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Total Credits
              </label>
              <p className="p-3 border rounded-lg text-sm bg-gray-50">
                {courseBucket.totalCredits}
              </p>
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Number of Courses
              </label>
              <p className="p-3 border rounded-lg text-sm bg-gray-50">
                {courseBucket.numberOfCourses}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <label className="block font-semibold mb-4 text-sm">
              Subject Types
            </label>
            <div className="flex flex-wrap gap-2">
              {courseBucket.subjectTypes?.length > 0 ? (
                courseBucket.subjectTypes.map((type) => (
                  <span
                    key={type.name}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {type.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No subject types assigned</span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <label className="block font-semibold mb-4 text-sm">
              Courses in Bucket
            </label>
            {courseBucket.courses?.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseBucket.courses.map(({ course, orderIndex }) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {orderIndex}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.credits || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link
                            to={`/courses/${course.id}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          >
                            View Course
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No courses added to this bucket</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}