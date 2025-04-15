import React, { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import PaginationFooter from "../PaginationFooter.tsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CourseBucket } from "../../hooks/courseBucketHooks/useFetchCourseBuckets.ts";

export default function CourseBucketsTable({
  buckets,
  totalPages,
  currentPage,
  setCurrentPage,
  isLoading,
  selectedBuckets,
  setSelectedBuckets,
  label,
}: {
  buckets: CourseBucket[] | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  setSelectedBuckets?: Dispatch<CourseBucket[]>;
  selectedBuckets?: CourseBucket[];
  label?: string;
}) {
  const navigate = useNavigate();
  const [expandedBuckets, setExpandedBuckets] = useState<string[]>([]);

  const toggleAccordion = (e: MouseEvent, bucketId: string) => {
    e.stopPropagation();
    setExpandedBuckets((prev) =>
      prev.includes(bucketId)
        ? prev.filter((id) => id !== bucketId)
        : [...prev, bucketId],
    );
  };

  const handleSelection = (
    e: MouseEvent<HTMLButtonElement>,
    bucket: CourseBucket,
  ) => {
    e.stopPropagation();
    if (selectedBuckets && setSelectedBuckets) {
      setSelectedBuckets([...selectedBuckets, bucket]);
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
                Name
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Total Credits
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Number of Courses
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
              ? Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <td key={i} className="py-4 px-4 text-sm">
                        <Skeleton />
                      </td>
                    ))}
                  </tr>
                ))
              : buckets?.map((bucket) => (
                  <React.Fragment key={bucket.id}>
                    <tr
                      onClick={(e) => toggleAccordion(e, bucket.id)}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {bucket.name || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {bucket.totalCredits ?? "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {bucket.numberOfCourses ?? "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {bucket.department?.name || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {bucket.subjectTypes?.length > 0 ? (
                            bucket.subjectTypes.map((type) => (
                              <div
                                key={type.name}
                                className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-medium"
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
                      <td className="py-4 px-4 text-right text-sm">
                        <div className="flex flex-row justify-end gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/course-buckets/${bucket.id}`);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="sr-only">View, {bucket.name}</span>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-150">
                            <div
                              className={`transform transition-transform duration-300 ${
                                expandedBuckets.includes(bucket.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              <ChevronDownIcon className="h-5 w-5" />
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedBuckets.includes(bucket.id) && (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 bg-gray-50">
                          <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[500px] opacity-100">
                            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                              <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Courses in this Bucket
                              </h3>
                              {bucket.courses?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {bucket.courses.map(({ course, orderIndex }) => (
                                    <Link
                                      to={`/courses/${course.id}`}
                                      key={course.id}
                                      className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors duration-150"
                                    >
                                      <p className="text-sm font-medium text-gray-900">
                                        {course.name || "N/A"}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {course.code || "N/A"}
                                      </p>
                                      <span className="inline-flex items-center mt-2 text-xs font-medium text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                                        Order: {orderIndex ?? "N/A"}
                                      </span>
                                    </Link>
                                  ))}
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
