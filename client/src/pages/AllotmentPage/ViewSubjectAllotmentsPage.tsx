import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import useSubjectAllotments from "../../hooks/subjectPreferenceHooks/useSubjectAllotments.ts";
import { useNavigate, useParams } from "react-router-dom";
import { AllotmentType } from "../../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import { ReactNode, useState } from "react";
import PaginationFooter from "../../components/PaginationFooter.tsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SubjectAllotmentCard from "../../components/SubjectAllotmentCard.tsx";
import useFetchSubjectInfo from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";
import useAllotmentStats from "../../hooks/subjectHooks/useAllotmentStats.ts";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  RefreshCw,
  Users,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CourseStatsSection from "../../components/CourseStatsSection";

dayjs.extend(relativeTime);

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export default function ViewSubjectAllotmentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const renderSubjectHeader = () => {
    if (infoLoading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 my-6">
          <Skeleton height={28} width={240} />
          <div className="mt-3 flex gap-3">
            <Skeleton height={24} width={100} />
            <Skeleton height={24} width={100} />
            <Skeleton height={24} width={100} />
          </div>
        </div>
      );
    }

    if (infoError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error loading subject information.</p>
        </div>
      );
    }

    if (!subjectInfo) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 my-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate("/subjects")}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Go back to subjects"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {subjectInfo.name}
              </h2>
            </div>
            <div className="flex flex-wrap mt-3 gap-3">
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-md">
                <Users className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-700">
                  {subjectInfo.batch.year}
                </span>
              </div>
              <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-md">
                <BookOpen className="h-4 w-4 text-purple-600 mr-2" />
                <span className="font-medium text-purple-700">
                  {subjectInfo.subjectType.name}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              disabled={allotmentsLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${allotmentsLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStatsCard = ({ title, value, icon, color }: StatsCardProps) => (
    <div className={`bg-${color}-50 rounded-lg p-4 border border-${color}-100`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <div className={`text-${color}-500`}>{icon}</div>
      </div>
      <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
    </div>
  );

  const renderAllotmentStats = () => {
    if (statsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <Skeleton height={20} width="60%" className="mb-2" />
              <Skeleton height={30} width="40%" />
            </div>
          ))}
        </div>
      );
    }

    if (statsError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Error loading statistics.</p>
        </div>
      );
    }

    if (!stats) return null;

    const totalAllottedStudents =
      stats.courses.reduce((acc, course) => acc + course.studentCount, 0) +
      stats.courseBuckets.reduce((acc, bucket) => acc + bucket.studentCount, 0);
    const totalStudents = totalAllottedStudents + stats.unallottedStudents;
    const completionRate =
      totalStudents > 0
        ? Math.round((totalAllottedStudents / totalStudents) * 100)
        : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderStatsCard({
          title: "Total Students",
          value: totalStudents,
          icon: <Users className="h-5 w-5" />,
          color: "blue",
        })}
        {renderStatsCard({
          title: "Allotted Students",
          value: totalAllottedStudents,
          icon: <CheckCircle className="h-5 w-5" />,
          color: "green",
        })}
        {renderStatsCard({
          title: "Pending Allotments",
          value: stats.unallottedStudents,
          icon: <Clock className="h-5 w-5" />,
          color: "yellow",
        })}
        {renderStatsCard({
          title: "Completion Rate",
          value: `${completionRate}%`,
          icon: <BarChart3 className="h-5 w-5" />,
          color: "indigo",
        })}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <PageHeader
          title="Subject Allotments"
          description="View and manage course allotments for this subject"
        />

        {renderSubjectHeader()}

        {/* Allotment Stats Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Allotment Statistics
          </h3>
          {renderAllotmentStats()}
        </div>

        {/* Course Statistics Section */}
        {stats && (
          <CourseStatsSection
            courses={stats.courses}
            courseBuckets={stats.courseBuckets}
            unallottedStudents={stats.unallottedStudents}
            loading={statsLoading}
            error={statsError}
          />
        )}

        {/* Allotments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900">Allotments</h3>
            <div className="w-full sm:w-96">
              <SearchBarWithDebounce
                value={search}
                setValue={setSearch}
                placeholder="Search by student name or registration number..."
              />
            </div>
          </div>

          {allotmentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <Skeleton height={20} width="60%" className="mb-3" />
                  <Skeleton height={16} width="40%" className="mb-2" />
                  <Skeleton height={16} width="40%" />
                </div>
              ))}
            </div>
          ) : allotmentsError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">Error loading allotments.</div>
              <button
                onClick={refetch}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Try again
              </button>
            </div>
          ) : (
            subjectAllotments && (
              <>
                {subjectAllotments.standaloneAllotments.length === 0 &&
                subjectAllotments.bucketAllotments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No allotments found.
                  </div>
                ) : (
                  <>
                    {subjectInfo?.subjectType.allotmentType ===
                      AllotmentType.STANDALONE && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Pagination Section */}
          <div className="mt-6">
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
      </div>
    </MainLayout>
  );
}
