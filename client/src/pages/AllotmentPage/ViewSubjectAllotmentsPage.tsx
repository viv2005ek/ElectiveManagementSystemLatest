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
import SubjectAllotmentCard from "../../components/SubjectAllotmentCard.tsx";
import useFetchSubjectInfo from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";
import useAllotmentStats from "../../hooks/subjectHooks/useAllotmentStats.ts";
import AllotmentDonutChart from "../../charts/AllotmentDonutChart.tsx";

export default function ViewSubjectAllotmentsPage() {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: subjectAllotments,
    isLoading: allotmentsLoading,
    error: allotmentsError,
    refetch,
  } = useSubjectAllotments(id, search);
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useAllotmentStats(id);
  const {
    data: subjectInfo,
    loading: infoLoading,
    error: infoError,
  } = useFetchSubjectInfo(id);

  return (
    <MainLayout>
      <div className="mt-8">
        <PageHeader title="View Subject Allotments" />

        {/* Subject Info Section */}
        <div className="my-6">
          {infoLoading ? (
            <Skeleton height={100} width="100%" />
          ) : infoError ? (
            <div className="text-red-500 text-center">
              Error loading subject info.
            </div>
          ) : (
            subjectInfo && (
              <div className="grid grid-cols-3 gap-4 bg-blue-100 p-4 rounded-lg">
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Subject Name
                  </div>
                  <div className="font-semibold">{subjectInfo.name}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Subject Type
                  </div>
                  <div className="font-semibold">
                    {subjectInfo.subjectType.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Batch
                  </div>
                  <div className="font-semibold">{subjectInfo.batch.year}</div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Allotment Stats Section */}
        <div className="mt-6 flex flex-col items-center">
          {statsLoading ? (
            <Skeleton circle={true} height={200} width={200} />
          ) : statsError ? (
            <div className="text-red-500">Error loading chart data.</div>
          ) : (
            stats && <AllotmentDonutChart stats={stats} />
          )}
        </div>

        {/* Allotments Section */}
        <div className="mt-6">
          <SearchBarWithDebounce
            value={search}
            setValue={setSearch}
            placeholder="Search students"
          />
          {allotmentsLoading ? (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="p-2 border border-gray-300 rounded-lg bg-gray-100"
                >
                  <Skeleton height={10} width="40%" className="mb-2" />
                  <Skeleton height={10} width="40%" className="mb-4" />
                  <Skeleton height={10} width="40%" />
                </div>
              ))}
            </div>
          ) : allotmentsError ? (
            <div className="text-red-500 text-center mt-4">
              Error loading allotments.
            </div>
          ) : (
            subjectAllotments && (
              <>
                {subjectAllotments.standaloneAllotments.length === 0 &&
                subjectAllotments.bucketAllotments.length === 0 ? (
                  <div className="text-gray-500 text-center mt-4">
                    No allotments found.
                  </div>
                ) : (
                  <>
                    {subjectInfo?.subjectType.allotmentType ===
                      AllotmentType.STANDALONE && (
                      <div className="mt-2 grid grid-cols-3 gap-2 border-1 border-gray-400">
                        {subjectAllotments.standaloneAllotments.map(
                          (allotment, index) => (
                            <SubjectAllotmentCard
                              allotment={allotment}
                              index={index}
                              key={index}
                            />
                          ),
                        )}
                      </div>
                    )}
                    {subjectInfo?.subjectType.allotmentType ===
                      AllotmentType.BUCKET && (
                      <div className="mt-2 grid grid-cols-3 gap-2 border-1 p-2 border-gray-400">
                        {subjectAllotments.bucketAllotments.map(
                          (allotment, index) => (
                            <SubjectAllotmentCard
                              allotment={allotment}
                              index={index}
                              key={index}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )
          )}
        </div>

        {/* Pagination Section */}
        <div className="my-4">
          {allotmentsLoading ? (
            <Skeleton height={40} width="100%" />
          ) : (
            <PaginationFooter
              totalPages={subjectAllotments?.totalPages || 1}
              currentPage={currentPage}
              setPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
