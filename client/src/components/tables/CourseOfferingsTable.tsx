import PaginationFooter from "../PaginationFooter.tsx";
import React, { Dispatch, SetStateAction } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CourseBucketOffering,
  CourseOffering,
} from "../../hooks/subjectHooks/useFetchSubjectOfferings.ts";
import { T } from "../../pages/SubjectPages/SubjectPreferencesFillingPage.tsx";

export default function CourseOfferingsTable({
  courses,
  courseBuckets,
  totalPages,
  currentPage,
  setCurrentPage,
  isLoading,
  handleAddToQueue,
  queue,
}: {
  courses: CourseOffering[] | null;
  courseBuckets: CourseBucketOffering[] | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  handleAddToQueue: (item: T) => void;
  queue: T[];
}) {
  const handleSelection = (e: React.MouseEvent<HTMLButtonElement>, item: T) => {
    e.stopPropagation();
    handleAddToQueue(item);
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
                    Total Seats
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Available Seats
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Action
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
                      </tr>
                    ))
                  : courses?.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="whitespace-nowrap font-semibold py-4 px-4 text-sm text-gray-900">
                          {course.code}
                        </td>
                        <td className="whitespace-nowrap font-semibold py-4 px-4 text-sm text-gray-900">
                          {course.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.totalSeats ?? "N/A"}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.availableSeats ?? "N/A"}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {!queue.some((item) => item.id === course.id) && (
                            <button
                              onClick={(e) => handleSelection(e, course)}
                              className={
                                "bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-opacity-80"
                              }
                            >
                              Choose
                            </button>
                          )}
                        </td>
                      </tr>
                    )) ||
                    courseBuckets?.map((bucket) => (
                      <tr
                        key={bucket.id}
                        className="hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {bucket.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {bucket.totalSeats ?? "N/A"}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {bucket.availableSeats ?? "N/A"}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <div className="w-full">
              <PaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
