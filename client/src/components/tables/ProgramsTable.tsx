import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Program,
  ProgramType,
} from "../../hooks/programHooks/useFetchPrograms.ts";
import React, { Dispatch, MouseEvent, SetStateAction } from "react";
import PaginationFooter from "../PaginationFooter.tsx";

const mapProgramTypeTag = (programType: ProgramType): string => {
  switch (programType) {
    case ProgramType.UNDERGRADUATE:
      return "text-blue-800 bg-blue-100";
    case ProgramType.POSTGRADUATE:
      return "text-green-800 bg-green-100";
    case ProgramType.PHD:
      return "text-yellow-800 bg-yellow-100";
    default:
      return "text-gray-500 bg-gray-100";
  }
};

export default function ProgramsTable({
  programs,
  loading,
  label,
  showActionButtons = true,
  selectedPrograms,
  setSelectedPrograms,
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  programs: Program[] | null | undefined;
  loading: boolean;
  label?: string;
  showActionButtons?: boolean;
  selectedPrograms?: Program[];
  setSelectedPrograms?: Dispatch<SetStateAction<Program[]>>;
  totalPages?: number;
  currentPage?: number;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
}) {
  const handleSelection = (
    e: MouseEvent<HTMLButtonElement>,
    program: Program,
  ) => {
    e.stopPropagation();
    if (selectedPrograms && setSelectedPrograms) {
      setSelectedPrograms([...selectedPrograms, program]);
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
                S.no
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
                Department
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Program type
              </th>
              {showActionButtons && (
                <th
                  scope="col"
                  className="py-3.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
              {selectedPrograms && setSelectedPrograms && (
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
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
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
                  </tr>
                ))
              : programs?.map((program, index) => (
                  <tr
                    key={program.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {program.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {program.department.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      <div
                        className={`${mapProgramTypeTag(program.programType)} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                      >
                        {program.programType}
                      </div>
                    </td>
                    {showActionButtons && (
                      <td className="py-4 px-4 text-right text-sm font-medium">
                        <Link
                          to={`/programs/${program.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                        >
                          Edit
                          <span className="sr-only">, {program.name}</span>
                        </Link>
                      </td>
                    )}
                    {selectedPrograms &&
                      setSelectedPrograms &&
                      !selectedPrograms.some(
                        (selectedProgram) => selectedProgram.id === program.id,
                      ) && (
                        <td className="py-4 px-4 text-right text-sm">
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                            onClick={(e: MouseEvent<HTMLButtonElement>) =>
                              handleSelection(e, program)
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
            totalPages={totalPages}
            currentPage={currentPage}
            setPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
