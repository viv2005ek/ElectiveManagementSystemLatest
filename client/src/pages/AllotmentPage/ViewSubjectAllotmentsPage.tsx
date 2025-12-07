import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import useSubjectAllotments from "../../hooks/subjectPreferenceHooks/useSubjectAllotments.ts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AllotmentType } from "../../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import { ReactNode, useState } from "react";
import PaginationFooter from "../../components/PaginationFooter.tsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SubjectAllotmentCard from "../../components/SubjectAllotmentCard.tsx";
import useFetchSubjectInfo from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";
import useAllotmentStats from "../../hooks/subjectHooks/useAllotmentStats.ts";
import useSubjectSections, {
  Section,
} from "../../hooks/sectionHooks/useSubjectSections.ts";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  RefreshCw,
  Trash2,
  Users,
   AlertTriangle, Play
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CourseStatsSection from "../../components/CourseStatsSection";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddSectionModal from "../../components/AddSectionModal";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { toast } from "sonner";
import axiosInstance from "../../axiosInstance";

dayjs.extend(relativeTime);

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export default function ViewSubjectAllotmentsPage() {const [isRunningPendingAllotments, setIsRunningPendingAllotments] = useState(false);

// Function to handle running pending allotments
const handleRunPendingAllotments = async () => {
  if (!id) return;
  
  if (!window.confirm(
    `Are you sure you want to run pending allotments for ${stats?.unallottedStudents} students? ` +
    `This will automatically assign students who didn't fill preferences to available courses.`
  )) {
    return;
  }

  setIsRunningPendingAllotments(true);
  try {
    const response = await axiosInstance.post(`/subjects/${id}/allotments/pending`);
    toast.success(response.data.message);
    
    // Refresh all data
    await refetch();
    // Refresh stats if you have a separate function for it
  } catch (error: any) {
    console.error("Error running pending allotments:", error);
    toast.error(error.response?.data?.error || "Failed to run pending allotments");
  } finally {
    setIsRunningPendingAllotments(false);
  }
};
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const {
    data: subjectAllotments,
    isLoading: allotmentsLoading,
    error: allotmentsError,
    refetch,
  } = useSubjectAllotments(id, search, currentPage);
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
  const {
    data: sections,
    isLoading: sectionsLoading,
    error: sectionsError,
    refetch: refetchSections,
  } = useSubjectSections(id);

  // Function to export allotments to CSV
  const exportAllotmentsToCSV = async () => {
  if (!id) return;
  setExportLoading(true);
  try {
    const response = await axiosInstance.get(`/subjects/${id}/allotments/export`, {
      params: { search: search || undefined },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (subjectInfo?.name || `subject_${id}`).replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
    a.href = url;
    a.download = `allotments_${safeName}_${subjectInfo?.batch?.year ?? ""}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Allotments exported successfully");
  } catch (err: any) {
    console.error("Export error", err);
    toast.error(err?.response?.data?.error || "Failed to export allotments");
  } finally {
    setExportLoading(false);
  }
};

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
              onClick={exportAllotmentsToCSV}
              disabled={exportLoading || !subjectAllotments || (subjectAllotments.standaloneAllotments.length === 0 && subjectAllotments.bucketAllotments.length === 0)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className={`h-4 w-4 ${exportLoading ? "animate-spin" : ""}`} />
              <span>{exportLoading ? "Exporting..." : "Export CSV"}</span>
            </button>
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

  // ALTERNATIVE: Calculate all values if the backend doesn't provide them
  const totalAllottedStudents = 
    (stats.courses?.reduce((acc, course) => acc + course.studentCount, 0) || 0) + 
    (stats.courseBuckets?.reduce((acc, bucket) => acc + bucket.studentCount, 0) || 0);
  
  const unallottedStudents = stats.unallottedStudents || 0;
  
  // Calculate total students by summing allotted and unallotted
  const totalStudents = totalAllottedStudents + unallottedStudents;
  
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
        value: unallottedStudents,
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

  const renderSectionsTable = () => {
    const handleDeleteSection = async (sectionId: string) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this section? This action cannot be undone.",
        )
      ) {
        return;
      }

      try {
        await axiosInstance.delete(`/elective-sections/${sectionId}`);
        toast.success("Section deleted successfully");
        await refetchSections();
      } catch (error) {
        console.error("Error deleting section:", error);
        toast.error("Failed to delete section");
      }
    };

    if (sectionsLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionsError) {
      return (
        <div className="text-center py-4">
          <AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Error loading sections.</p>
        </div>
      );
    }

    if (!sections || sections.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No sections found for this subject.</p>
        </div>
      );
    }

    // Group sections by course
    const sectionsByCourse = sections.reduce(
      (acc, section) => {
        const courseId = section.Course.id;
        if (!acc[courseId]) {
          acc[courseId] = {
            course: section.Course,
            sections: [],
          };
        }
        acc[courseId].sections.push(section);
        return acc;
      },
      {} as Record<string, { course: Section["Course"]; sections: Section[] }>,
    );

    return (
      <div className="space-y-4">
        {Object.entries(sectionsByCourse).map(
          ([courseId, { course, sections }]) => (
            <Disclosure
              key={courseId}
              as="div"
              className="bg-white overflow-hidden border border-gray-200 shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              {({ open }) => (
                <>
                  <DisclosureButton className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-3">
                          {course.name}
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {course.code}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {sections.length} section
                          {sections.length !== 1 ? "s" : ""} •{" "}
                          {sections.reduce(
                            (acc, section) => acc + section.students.length,
                            0,
                          )}{" "}
                          students enrolled
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/elective-sections/${course.id}`}
                      className={
                        "text-sm font-semibold text-blue-700 hover:underline"
                      }
                    >
                      Manage sections
                    </Link>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm text-gray-900">
                          {sections.reduce(
                            (acc, section) =>
                              acc +
                              (section.SubjectCourseWithSeats.availableSeats ||
                                0),
                            0,
                          )}{" "}
                          seats available
                        </div>
                        <div className="text-xs text-gray-500">
                          {sections.reduce(
                            (acc, section) =>
                              acc +
                              (section.SubjectCourseWithSeats.totalSeats || 0),
                            0,
                          )}{" "}
                          total seats
                        </div>
                      </div>
                      <div
                        className={`transform transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </DisclosureButton>
                  <DisclosurePanel>
                    {({ close }) => (
                      <div className="border-t border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Section Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Professor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Students
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {sections.map((section) => (
                                <tr
                                  key={section.id}
                                  className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {section.name}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {section.professor ? (
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {section.professor.firstName}{" "}
                                          {section.professor.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Professor
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Not Assigned
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {section.students.length}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                      onClick={() =>
                                        handleDeleteSection(section.id)
                                      }
                                      disabled={section.students.length > 0}
                                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium 
                                      ${
                                        section.students.length > 0
                                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                          : "text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                      }`}
                                      title={
                                        section.students.length > 0
                                          ? "Cannot delete section with enrolled students"
                                          : "Delete section"
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 mr-1.5" />
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          ),
        )}
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
    onRunPendingAllotments={handleRunPendingAllotments}
    isRunningPendingAllotments={isRunningPendingAllotments}
    subjectId={id}
  />
)}

        {/* Sections Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 my-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Subject Sections
            </h3>
            <div className={"flex flex-row gap-4"}>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex flex-row items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-sm px-3 py-2 text-white rounded-lg transition-colors"
              >
                <PlusIcon className="h-5 w-5 stroke-2" />
                <span>Add Section</span>
              </button>
            </div>
          </div>
          {renderSectionsTable()}
        </div>

        {/* Add Section Modal */}
        {id && (
          <AddSectionModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            subjectId={id}
            onSuccess={() => {
              refetchSections();
            }}
          />
        )}

        {/* Allotments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900">Allotments</h3>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-96">
                <SearchBarWithDebounce
                  value={search}
                  setValue={setSearch}
                  placeholder="Search by student name or registration number..."
                />
              </div>
              <button
                onClick={exportAllotmentsToCSV}
                disabled={exportLoading || !subjectAllotments || (subjectAllotments.standaloneAllotments.length === 0 && subjectAllotments.bucketAllotments.length === 0)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Download className={`h-4 w-4 ${exportLoading ? "animate-spin" : ""}`} />
                <span>{exportLoading ? "Exporting..." : "Export CSV"}</span>
              </button>
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