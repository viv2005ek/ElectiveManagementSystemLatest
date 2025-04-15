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
      return "text-blue-800 bg-blue-200";
    case ProgramType.POSTGRADUATE:
      return "text-green-800  bg-green-200";
    case ProgramType.PHD:
      return "text-yellow-800 bg-yellow-200";
    default:
      return "text-gray-500";
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
    <div className="">
      {label && (
        <div className={"font-semibold text-sm underline"}>{label}</div>
      )}
      <div className="mt-4 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    S.no
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
                    Department
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Program type
                  </th>
                  {showActionButtons && (
                    <th
                      scope="col"
                      className="py-3 px-4 text-right text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  )}
                  {selectedPrograms && setSelectedPrograms && (
                    <th
                      scope="col"
                      className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                    ></th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-right text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-right text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-right text-sm">
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  : programs?.map((program, index) => (
                      <tr
                        key={program.id}
                        className={"hover:bg-gray-100 cursor-auto"}
                      >
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap py-4 font-semibold font px-4 text-sm text-gray-900">
                          {program.name}
                        </td>
                        <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                          {program.department.name}
                        </td>
                        <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                          <div
                            className={`${mapProgramTypeTag(program.programType)} w-min px-2 rounded-full py-0.5 text-xs`}
                          >
                            {program.programType}
                          </div>
                        </td>
                        {showActionButtons && (
                          <td className="whitespace-nowrap py-4 px-4 text-right text-sm font-medium">
                            <Link
                              to={"#"}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                              <span className="sr-only">, {program.name}</span>
                            </Link>
                          </td>
                        )}
                        {selectedPrograms &&
                          setSelectedPrograms &&
                          !selectedPrograms.some(
                            (selectedProgram) =>
                              selectedProgram.id === program.id,
                          ) && (
                            <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                              <button
                                className="bg-blue-500 py-1 px-3 text-white rounded-lg"
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
            {totalPages && currentPage && setCurrentPage && (
              <PaginationFooter
                totalPages={totalPages}
                currentPage={currentPage}
                setPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
