import { useNavigate } from "react-router-dom";
import { Student } from "../../hooks/studentHooks/useFetchStudents.ts";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import PaginationFooter from "../PaginationFooter.tsx";
import { Dispatch, SetStateAction } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StudentsTable({
  students,
  totalPages,
  currentPage,
  setCurrentPage,
  isLoading,
  label,
}: {
  students: Student[] | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  label?: string;
}) {
  const navigate = useNavigate();

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
                Registration no.
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
                Program
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
                Semester
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Batch
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                  </tr>
                ))
              : students?.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {student.registrationNumber}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {student.firstName} {student.middleName}{" "}
                      {student.lastName}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {student.program.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {student.program.department.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {student.semester}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {student.batch.year}
                    </td>
                    <td className="py-4 px-4 text-right text-sm">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/students/${student.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                        >
                          <EyeIcon className="h-5 w-5" />
                          <span className="sr-only">
                            View {student.firstName}
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/students/${student.id}/edit`);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span className="sr-only">
                            Edit {student.firstName}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
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
