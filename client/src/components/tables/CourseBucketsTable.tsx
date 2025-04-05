import { Dispatch, SetStateAction, useState } from "react";
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
}: {
  buckets: CourseBucket[] | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  const [expandedBuckets, setExpandedBuckets] = useState<string[]>([]);

  const toggleAccordion = (bucketId: string) => {
    setExpandedBuckets((prev) =>
      prev.includes(bucketId)
        ? prev.filter((id) => id !== bucketId)
        : [...prev, bucketId],
    );
  };

  return (
    <div className="mt-6">
      <div className="mt-6 flow-root">
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
                    Number of Courses
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Department
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Subject Types
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
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
                  : buckets?.map((bucket) => (
                      <>
                        <tr
                          onClick={() => toggleAccordion(bucket.id)}
                          key={bucket.id}
                          className="hover:bg-gray-100 hover:cursor-pointer transition-all"
                        >
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900 font-semibold">
                            {bucket.name}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {bucket.totalCredits}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {bucket.numberOfCourses}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                            {bucket.department.name}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm flex flex-col text-gray-900 gap-0.5">
                            {bucket.subjectTypes?.length > 0 ? (
                              bucket.subjectTypes.map((type) => (
                                <div
                                  key={type.name}
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
                              <button
                                onClick={() =>
                                  navigate(`/course-buckets/${bucket.id}`)
                                }
                              >
                                <EyeIcon className="h-6 w-6 stroke-gray-500" />
                              </button>
                              <button className="transition-transform duration-300">
                                <div
                                  className={`transform transition-transform duration-300 ${expandedBuckets.includes(bucket.id) ? "rotate-180" : ""}`}
                                >
                                  <ChevronDownIcon className="h-6 w-6 stroke-gray-500" />
                                </div>
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedBuckets.includes(bucket.id) && (
                          <tr>
                            <td colSpan={6} className="px-4 py-3 bg-gray-50">
                              <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[500px] opacity-100">
                                <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                                    Courses in this Bucket
                                  </h3>
                                  {bucket.courseBucketCourses.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4">
                                      {bucket.courseBucketCourses.map(
                                        ({ course, orderIndex }) => (
                                          <Link
                                            to={`/courses/${course.id}`}
                                            key={course.id}
                                            className="p-3 border border-gray-200 transition-all rounded-xl hover:bg-blue-100 bg-gray-100"
                                          >
                                            <p className="text-sm font-medium text-gray-900">
                                              {course.name}
                                            </p>
                                            <p className="text-xs text-gray-700">
                                              {course.code}
                                            </p>
                                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                              Order: {orderIndex}
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
                      </>
                    ))}
              </tbody>
            </table>
            <div className="w-full">
              <PaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                nextPage={() => setCurrentPage(currentPage + 1)}
                prevPage={() => setCurrentPage(currentPage - 1)}
                setPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
