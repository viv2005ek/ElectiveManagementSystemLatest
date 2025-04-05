import React, { Dispatch, SetStateAction, useState } from "react";
import PaginationFooter from "../PaginationFooter.tsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CourseBucketOffering } from "../../hooks/subjectHooks/useFetchSubjectOfferings.ts";
import { T } from "../../pages/SubjectPages/SubjectPreferencesFillingPage.tsx";

export default function CourseBucketOfferingsTable({
  courseBuckets,
  totalPages,
  currentPage,
  setCurrentPage,
  isLoading,
  handleAddToQueue,
  queue,
}: {
  courseBuckets: CourseBucketOffering[] | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  handleAddToQueue: (item: T) => void;
  queue: T[];
}) {
  const [openBucketId, setOpenBucketId] = useState<string | null>(null);

  const toggleAccordion = (bucketId: string) => {
    setOpenBucketId(openBucketId === bucketId ? null : bucketId);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

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
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  : courseBuckets?.map((courseBucket, index) => (
                      <React.Fragment key={courseBucket.id}>
                        <tr
                          className="hover:bg-gray-100 hover:cursor-pointer transition-all"
                          onClick={() => toggleAccordion(courseBucket.id)}
                        >
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {index + 1}.
                          </td>
                          <td className="whitespace-nowrap font-semibold py-4 px-4 text-sm text-gray-900">
                            {courseBucket.name}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {courseBucket.totalSeats ?? "N/A"}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {courseBucket.availableSeats ?? "N/A"}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {!queue.some(
                              (item) => item.id === courseBucket.id,
                            ) && (
                              <button
                                onClick={(e) =>
                                  handleSelection(e, courseBucket)
                                }
                                className={
                                  "bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-opacity-80"
                                }
                              >
                                Choose
                              </button>
                            )}
                          </td>
                        </tr>
                        {openBucketId === courseBucket.id && (
                          <tr>
                            <td colSpan={4} className="p-0">
                              <div className="overflow-hidden transition-all duration-300">
                                <table className="min-w-full divide-y divide-gray-300 bg-gray-50">
                                  <thead>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="py-3 px-6 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Course Code
                                      </th>
                                      <th
                                        scope="col"
                                        className="py-3 px-6 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Course Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="py-3 px-6 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Credits
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {courseBucket.courses.map((course) => (
                                      <tr key={course.id}>
                                        <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-900">
                                          {course.code}
                                        </td>
                                        <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-900">
                                          {course.name}
                                        </td>
                                        <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-900">
                                          {course.credits}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
              </tbody>
            </table>
            <div className="w-full mt-4">
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
