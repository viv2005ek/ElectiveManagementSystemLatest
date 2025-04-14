import React, { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CourseBucketWithSeats } from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function CourseBucketsWithSeatsTable({
  courseBucketsWithSeats,
  isLoading,
  label,
}: {
  courseBucketsWithSeats: CourseBucketWithSeats[] | null;
  isLoading: boolean;
  label?: string;
}) {
  const [expandedBuckets, setExpandedBuckets] = useState<string[]>([]);

  const toggleAccordion = (e: MouseEvent, bucketId: string) => {
    e.stopPropagation();
    setExpandedBuckets((prev) =>
      prev.includes(bucketId)
        ? prev.filter((id) => id !== bucketId)
        : [...prev, bucketId],
    );
  };

  // const handleSelection = (
  //   e: MouseEvent<HTMLButtonElement>,
  //   bucket: CourseBucket,
  // ) => {
  //   e.stopPropagation();
  //   if (selectedBuckets && setSelectedBuckets) {
  //     setSelectedBuckets([...selectedBuckets, bucket]);
  //   }
  // };

  return (
    <div className="mt-6">
      {label && <div className={"font-semibold text-sm"}>{label}</div>}
      <div className="mt-4 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Total Credits
                  </th>

                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Department
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Seats
                  </th>

                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <td
                            key={i}
                            className="whitespace-nowrap py-4 px-4 text-sm"
                          >
                            <Skeleton />
                          </td>
                        ))}
                      </tr>
                    ))
                  : courseBucketsWithSeats?.map((courseBucketWithSeats) => (
                      <React.Fragment
                        key={courseBucketWithSeats.courseBucket.id}
                      >
                        <tr
                          onClick={(e) =>
                            toggleAccordion(
                              e,
                              courseBucketWithSeats.courseBucket.id,
                            )
                          }
                          key={courseBucketWithSeats.courseBucket.id}
                          className="hover:bg-gray-100 hover:cursor-pointer transition-all"
                        >
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900 font-semibold">
                            {courseBucketWithSeats.courseBucket.name || "N/A"}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {courseBucketWithSeats.courseBucket.totalCredits ??
                              "N/A"}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {courseBucketWithSeats.courseBucket.department
                              ?.name || "N/A"}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {courseBucketWithSeats.totalSeats || "N/A"}
                          </td>
                          {/*<td className="whitespace-nowrap py-4 px-4 text-sm flex flex-col text-gray-900 gap-0.5">*/}
                          {/*  {courseBucketWithSeats.subjectTypes?.length > 0 ? (*/}
                          {/*    courseBucketWithSeats.subjectTypes.map((type) => (*/}
                          {/*      <div*/}
                          {/*        key={type.name}*/}
                          {/*        className="text-xs bg-blue-200 text-blue-700 w-min px-1 rounded-full"*/}
                          {/*      >*/}
                          {/*        {type.name}*/}
                          {/*      </div>*/}
                          {/*    ))*/}
                          {/*  ) : (*/}
                          {/*    <span className="text-xs text-gray-500">*/}
                          {/*      No types added*/}
                          {/*    </span>*/}
                          {/*  )}*/}
                          {/*</td>*/}
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            <div className="flex flex-row justify-end gap-4">
                              <button className="transition-transform duration-300">
                                <div
                                  className={`transform transition-transform duration-300 ${
                                    expandedBuckets.includes(
                                      courseBucketWithSeats.courseBucket.id,
                                    )
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                >
                                  <ChevronDownIcon className="h-6 w-6 stroke-gray-500" />
                                </div>
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedBuckets.includes(
                          courseBucketWithSeats.courseBucket.id,
                        ) && (
                          <tr>
                            <td colSpan={6} className="px-4 py-3 bg-gray-50">
                              <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[500px] opacity-100">
                                <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                                    Courses in this Bucket
                                  </h3>
                                  {courseBucketWithSeats.courseBucket.courses
                                    ?.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4">
                                      {courseBucketWithSeats.courseBucket.courses.map(
                                        ({ course, orderIndex }) => (
                                          <Link
                                            to={`/courses/${course.id}`}
                                            key={course.id}
                                            className="p-3 border border-gray-200 transition-all rounded-xl hover:bg-blue-100 bg-gray-100"
                                          >
                                            <p className="text-sm font-medium text-gray-900">
                                              {course.name || "N/A"}
                                            </p>
                                            <p className="text-xs text-gray-700">
                                              {course.code || "N/A"}
                                            </p>
                                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                              Order: {orderIndex ?? "N/A"}
                                            </span>
                                          </Link>
                                        ),
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      No courses added.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
