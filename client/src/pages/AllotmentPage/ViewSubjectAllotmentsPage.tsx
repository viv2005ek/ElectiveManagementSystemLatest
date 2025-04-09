import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import useSubjectAllotments from "../../hooks/subjectPreferenceHooks/useSubjectAllotments.ts";
import { useParams } from "react-router-dom";
import { AllotmentType } from "../../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import { useState } from "react";
import PaginationFooter from "../../components/PaginationFooter.tsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ViewSubjectAllotmentsPage() {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch, error } = useSubjectAllotments(id, search);

  return (
    <MainLayout>
      <div className="mt-8">
        <PageHeader title="View Subject Allotments" />
        <div className="my-6">
          {isLoading ? (
            <div className={"mt-6 px-4"}>
              <Skeleton height={30} width={200} />
              <Skeleton height={20} width={150} className="mt-2" />
              <Skeleton height={20} width={100} className="mt-2" />
              <div className="mt-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="mb-4">
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={15} width="40%" className="mt-2" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center mt-4">
              Failed to load data. Please try again.
              <button
                onClick={refetch}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className={"mt-6 px-4 flex flex-col gap-4"}>
              <div className={"flex flex-col"}>
                <div className={"text-sm font-semibold text-gray-600"}>
                  Subject name
                </div>
                <div className="text-lg font-semibold">{data?.name}</div>
              </div>
              <div>
                <div className={"text-sm font-semibold text-gray-600"}>
                  Subject type
                </div>
                <div className="text-lg font-semibold">
                  {data?.subjectType.name}
                </div>
              </div>
              <div className={"flex flex-col"}>
                <div className={"text-sm font-semibold text-gray-600"}>
                  Batch
                </div>
                <div className="text-lg font-semibold">{data?.batch.year}</div>
              </div>{" "}
              <div className={"text-lg font-semibold underline"}>
                Allotments
              </div>
              <SearchBarWithDebounce
                value={search}
                setValue={setSearch}
                placeholder={"Search students"}
              />
              {data?.standaloneAllotments.length === 0 &&
              data?.bucketAllotments.length === 0 ? (
                <div className="text-gray-500 text-center mt-4">
                  No allotments found.
                </div>
              ) : (
                <>
                  {data?.subjectType.allotmentType ===
                    AllotmentType.STANDALONE && (
                    <div className="mt-2 grid grid-cols-3 gap-2 border-1 p-2 border-gray-400 ">
                      {data.standaloneAllotments.map((allotment, index) => (
                        <div
                          key={index}
                          className="p-2 border relative border-gray-400 rounded-md hover:shadow-md bg-gray-100 hover:bg-gray-50 transition-all mb-2 group"
                        >
                          <div className="font-medium">
                            {allotment.student.firstName}{" "}
                            {allotment.student.lastName}{" "}
                            <div className={"text-sm font-semibold"}>
                              {allotment.student.registrationNumber}
                            </div>
                          </div>
                          <div className={"mt-2"}>
                            <div className={"text-xs font-semibold"}>
                              Course
                            </div>
                            <div className="text-blue-700 font-semibold">
                              {allotment.course.name}
                            </div>
                          </div>
                          <button
                            className={
                              "hover:bg-gray-200 p-1 rounded-lg absolute top-2 right-2"
                            }
                          >
                            <PencilIcon className=" h-5 w-5 ease-in-out opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                          <button
                            className={
                              "hover:bg-gray-200 p-1 rounded-lg absolute bottom-2 right-2"
                            }
                          >
                            <TrashIcon className=" h-5 w-5 ease-in-out opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {data?.subjectType.allotmentType === AllotmentType.BUCKET && (
                    <div className="mt-2 grid grid-cols-3 gap-2 border-1 p-2 border-gray-400 ">
                      {data.bucketAllotments.map((allotment, index) => (
                        <div
                          key={index}
                          className="p-2 border relative border-gray-400 rounded-md hover:shadow-md bg-gray-100 hover:bg-gray-50 transition-all mb-2 group"
                        >
                          <div className="font-medium">
                            {allotment.student.firstName}{" "}
                            {allotment.student.lastName}{" "}
                            <div className={"text-sm font-semibold"}>
                              {allotment.student.registrationNumber}
                            </div>
                          </div>
                          <div className={"mt-2"}>
                            <div className={"text-xs font-semibold"}>
                              Course
                            </div>
                            <div className="text-blue-700 font-semibold">
                              {allotment.courseBucket.name}
                            </div>
                          </div>
                          <button
                            className={
                              "hover:bg-gray-200 p-1 rounded-lg absolute top-2 right-2"
                            }
                          >
                            <PencilIcon className=" h-5 w-5 ease-in-out opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                          <button
                            className={
                              "hover:bg-gray-200 p-1 rounded-lg absolute bottom-2 right-2"
                            }
                          >
                            <TrashIcon className=" h-5 w-5 ease-in-out opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div className={"my-4"}>
          {isLoading ? (
            <Skeleton height={40} width={"full"} />
          ) : (
            <PaginationFooter
              totalPages={data?.totalPages || 1}
              currentPage={currentPage}
              setPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
