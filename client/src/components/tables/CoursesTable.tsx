import { useNavigate } from "react-router-dom";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import PaginationFooter from "../PaginationFooter.tsx";
import { Dispatch, SetStateAction } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Course } from "../../hooks/courseHooks/useFetchCourses.ts";

export default function CoursesTable({
  courses,
  totalPages,
  currentPage,
  setCurrentPage,
  isLoading,
}: {
  courses: Course[] | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
}) {
  const navigate = useNavigate();

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-6">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Course code
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Credits
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Categories
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-right text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index}>
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
                        className="hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.code}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.credits}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.department.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm flex flex-col text-gray-900 gap-0.5">
                          {course.subjectTypes?.length > 0 ? (
                            course.subjectTypes.map((type) => (
                              <div
                                key={type.id} // Adding a key for better React performance
                                className="text-xs bg-blue-200 text-blue-700 w-min px-1 rounded-full"
                              >
                                {type.name}
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              No types added
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          <div className="flex flex-row justify-end gap-4">
                            <EyeIcon className="h-6 w-6 stroke-gray-500" />
                            <PencilIcon className="h-6 w-6 stroke-gray-500" />
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <div className="w-full">
              <PaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                nextPage={nextPage}
                prevPage={prevPage}
                setPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
