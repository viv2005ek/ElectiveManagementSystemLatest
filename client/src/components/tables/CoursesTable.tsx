import { useNavigate } from "react-router-dom";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import PaginationFooter from "../PaginationFooter.tsx";
import React, { Dispatch, MouseEvent, SetStateAction } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Course } from "../../hooks/courseHooks/useFetchCourses.ts";

export default function CoursesTable({
  courses,
  totalPages,
  currentPage,
  setCurrentPage,
  isLoading,
  selectedCourses,
  setSelectedCourses,
  showActionButtons = true,
  label,
}: {
  courses: Course[] | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  selectedCourses?: Course[];
  setSelectedCourses?: Dispatch<Course[]>;
  showActionButtons?: boolean;
  label?: string;
}) {
  const navigate = useNavigate();

  const handleSelection = (
    e: MouseEvent<HTMLButtonElement>,
    course: Course,
  ) => {
    e.stopPropagation();
    if (selectedCourses && setSelectedCourses) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {label && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">{label}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Course code
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Credits
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Subject Types
              </th>
              {showActionButtons && (
                <th
                  scope="col"
                  className="py-3.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
              {selectedCourses && setSelectedCourses && (
                <th
                  scope="col"
                  className="py-3.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Select
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                  </tr>
                ))
              : courses?.map((course) => (
                  <tr
                    onClick={() => navigate(`/courses/${course.id}`)}
                    key={course.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {course.code}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {course.credits}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {course.department.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {course.subjectTypes &&
                        course.subjectTypes?.length > 0 ? (
                          course.subjectTypes.map((type) => (
                            <div
                              key={type.id}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium"
                            >
                              {type.name}
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">
                            No types added
                          </span>
                        )}
                      </div>
                    </td>

                    {showActionButtons && (
                      <td className="py-4 px-4 text-right text-sm">
                        <div className="flex flex-row justify-end gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/courses/${course.id}`);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="sr-only">View, {course.name}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/courses/${course.id}/edit`);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          >
                            <PencilIcon className="h-5 w-5" />
                            <span className="sr-only">Edit, {course.name}</span>
                          </button>
                        </div>
                      </td>
                    )}
                    {selectedCourses &&
                      setSelectedCourses &&
                      !selectedCourses.some(
                        (selectedCourse) => selectedCourse.id === course.id,
                      ) && (
                        <td className="py-4 px-4 text-right text-sm">
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                            onClick={(e: MouseEvent<HTMLButtonElement>) =>
                              handleSelection(e, course)
                            }
                          >
                            Add
                          </button>
                        </td>
                      )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {totalPages && currentPage && setCurrentPage && (
        <div className="px-6 py-4 border-t border-gray-200">
          <PaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
