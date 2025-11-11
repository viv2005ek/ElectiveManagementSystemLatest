import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Clock,
  Download,
  Filter,
  Info,
  RefreshCw,
  Users,
} from "lucide-react";
import useRunAllotment from "../../hooks/subjectHooks/useRunAllotment.ts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSubjectPreferences from "../../hooks/subjectPreferenceHooks/useSubjectPreferences.ts";
import Skeleton from "react-loading-skeleton";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import Tabs, { Tab } from "../../components/Tabs.tsx";
import useFetchSubjectInfo from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";
import PaginationFooter from "../../components/PaginationFooter.tsx";
import StudentPreferenceCard from "../../components/StudentPreferenceCard.tsx";
import axiosInstance from "../../axiosInstance.ts";
import { toast } from "sonner";

dayjs.extend(relativeTime);

const tabs: Tab[] = [
  { name: "All", current: true, value: "" },
  { name: "Completed", current: true, value: "filled" },
  { name: "Pending", current: false, value: "not-filled" },
];

export default function SubjectPreferencesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const [showStats, setShowStats] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const { data, loading, error, fetchPreferences } = useSubjectPreferences(
    id,
    currentPage,
    tabs.find((tab) => tab.name === activeTab)?.value || "",
    search,
  );
  const {
    data: subjectInfo,
    loading: infoLoading,
    fetchSubjectInfo,
  } = useFetchSubjectInfo(id);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab]);

  const { runAllotment, loading: allotmentLoading } = useRunAllotment({
    onSuccess: () => {
      fetchPreferences();
      alert("Allotment process completed successfully.");
    },
    onError: (errorMsg) => {
      alert(`Failed to run allotment: ${errorMsg}`);
    },
  });

  const handleRunAllotment = () => {
    if (!id) return;
    if (
      window.confirm(
        "Are you sure you want to run the allotment process? This action cannot be undone.",
      )
    ) {
      runAllotment({ subjectId: id });
    }
  };

  // Export functionality
  const handleExportData = async () => {
    if (!id || !subjectInfo) return;

    setExportLoading(true);
    try {
      // Fetch all preferences for export (without pagination)
      const response = await axiosInstance.get(
        `/subject-preferences/${id}`,
        {
          params: { 
            preferenceStatus: tabs.find((tab) => tab.name === activeTab)?.value || "",
            search: search || undefined,
            page: 1,
            limit: 10000 // Large limit to get all records
          },
        },
      );

      const exportData = response.data;
      let csvContent = "";
      
      // Define headers based on allotment type
      const headers = [
        "Registration Number",
        "Student Name",
        "Preference Status",
        "Preferences Count"
      ];

      // Add preference columns based on allotment type
      if (subjectInfo.subjectType.allotmentType === "STANDALONE") {
        headers.push("Priority 1 Course", "Priority 2 Course", "Priority 3 Course");
      } else if (subjectInfo.subjectType.allotmentType === "BUCKET") {
        headers.push("Priority 1 Bucket", "Priority 2 Bucket", "Priority 3 Bucket");
      }

      // Add headers
      csvContent += headers.join(",") + "\n";

      // Process students data
      if (exportData.students && exportData.students.length > 0) {
        exportData.students.forEach((student: any) => {
          const baseRow = [
            `"${student.registrationNumber}"`,
            `"${student.firstName} ${student.lastName}"`,
            `"${student.isPreferenceFilled ? 'Completed' : 'Pending'}"`,
            `"${student.preferences ? 'Has Preferences' : 'No Preferences'}"`
          ];

          // Add preferences based on allotment type
          let preferenceRow = baseRow;
          
          if (student.preferences) {
            if (subjectInfo.subjectType.allotmentType === "STANDALONE") {
              preferenceRow.push(
                `"${student.preferences.firstPreferenceCourse?.name || 'Not selected'}"`,
                `"${student.preferences.secondPreferenceCourse?.name || 'Not selected'}"`,
                `"${student.preferences.thirdPreferenceCourse?.name || 'Not selected'}"`
              );
            } else if (subjectInfo.subjectType.allotmentType === "BUCKET") {
              preferenceRow.push(
                `"${student.preferences.firstPreferenceCourseBucket?.name || 'Not selected'}"`,
                `"${student.preferences.secondPreferenceCourseBucket?.name || 'Not selected'}"`,
                `"${student.preferences.thirdPreferenceCourseBucket?.name || 'Not selected'}"`
              );
            }
          } else {
            // Add empty columns for no preferences
            for (let i = 1; i <= 3; i++) {
              preferenceRow.push('"Not selected"');
            }
          }

          csvContent += preferenceRow.join(",") + "\n";
        });
      }

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `preferences_${subjectInfo.name.replace(/\s+/g, '_')}_${subjectInfo.batch.year}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Preferences exported successfully");
    } catch (error) {
      console.error("Error exporting preferences:", error);
      toast.error("Failed to export preferences");
    } finally {
      setExportLoading(false);
    }
  };

  const renderSubjectHeader = () =>
    infoLoading ? (
      <div className="bg-white rounded-lg shadow-md p-6 my-6 border-l-4 border-blue-500">
        <Skeleton height={28} width={240} />
        <div className="mt-3 flex gap-3">
          <Skeleton height={24} width={100} />
          <Skeleton height={24} width={100} />
          <Skeleton height={24} width={100} />
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-md p-6 my-6 border-l-4 border-blue-500">
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
                {subjectInfo?.name}
              </h2>
            </div>
            <div className="flex flex-wrap mt-3 gap-3">
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-md">
                <Users className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-700">
                  {subjectInfo?.batch.year}
                </span>
              </div>
              {subjectInfo?.dueDate && (
                <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-md">
                  <Calendar className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-700">
                    {dayjs(subjectInfo.dueDate).format("D MMMM YYYY")}
                  </span>
                </div>
              )}
              <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-md">
                <BookOpen className="h-4 w-4 text-purple-600 mr-2" />
                <span className="font-medium text-purple-700">
                  {subjectInfo?.subjectType.name}
                </span>
              </div>
              <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-md">
                <ClipboardCheck className="h-4 w-4 text-green-600 mr-2" />
                <span className="font-medium text-green-700">
                  {subjectInfo?.subjectType.allotmentType}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {subjectInfo?.dueDate &&
              dayjs(subjectInfo?.dueDate).isAfter(dayjs()) && (
                <div className="text-sm flex items-center justify-end bg-green-50 px-3 py-1.5 rounded-md">
                  <Clock className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-green-700 font-medium">
                    {dayjs(subjectInfo.dueDate).fromNow(true)} remaining
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    );

  const renderStats = () => {
    if (!data) return null;

    const totalStudents = data.totalStudents || 0;
    const completedCount = data.filledPreferencesCount || 0;
    const pendingCount = data.pendingStudentsCount || totalStudents - completedCount;
    const completionPercentage =
      totalStudents > 0
        ? Math.round((completedCount / totalStudents) * 100)
        : 0;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">
            Preference Statistics
          </h3>
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-indigo-600 hover:text-indigo-900 transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">
                  Total Students
                </span>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                {totalStudents}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">
                  Completed
                </span>
                <ClipboardCheck className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-800 mt-1">
                {completedCount}
              </p>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">
                  Pending
                </span>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-800 mt-1">
                {pendingCount}
              </p>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${100 - completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <PageHeader title="Subject Preferences" />

        {renderSubjectHeader()}

        {renderStats()}

        {/* Search and Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full sm:w-96">
            <SearchBarWithDebounce
              value={search}
              setValue={setSearch}
              placeholder="Search by student name or registration number..."
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleExportData}
              disabled={exportLoading || !data || data.students.length === 0}
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className={`h-4 w-4 ${exportLoading ? "animate-spin" : ""}`} />
              <span>{exportLoading ? "Exporting..." : "Export"}</span>
            </button>

            <button
              onClick={() => navigate(`/subjects/${id}/allotments`)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <span>View Allotments</span>
            </button>

            <button
              onClick={fetchPreferences}
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              className={`px-4 py-2.5 rounded-lg ${
                allotmentLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white flex items-center gap-2 transition-colors`}
              onClick={handleRunAllotment}
              disabled={loading || allotmentLoading}
            >
              {allotmentLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <span>Run Allotment</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <Tabs tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
        </div>

        {/* Loading fallback with skeletons */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <Skeleton circle height={32} width={32} />
                <div className="flex-1">
                  <Skeleton height={14} width="60%" />
                  <Skeleton height={12} width="40%" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 rounded-lg border border-red-200 text-center">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-500" />
            <p className="text-red-600 font-medium text-lg mb-1">{error}</p>
            <p className="text-red-500 text-sm mb-4">
              Please check your connection and try again
            </p>
            <button
              onClick={fetchPreferences}
              className="px-4 py-2 bg-white border border-red-300 rounded-md text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : data ? (
          <div className="space-y-4 mb-4">
            {data.students.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No students found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors text-sm font-medium"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              data.students.map((student, index) => (
                <StudentPreferenceCard
                  key={student.id}
                  student={student}
                  index={index}
                  allotmentType={subjectInfo?.subjectType.allotmentType}
                />
              ))
            )}
          </div>
        ) : null}

        {data && data.totalPages > 1 && (
          <div className="mt-6">
            <PaginationFooter
              totalPages={data.totalPages}
              currentPage={currentPage}
              setPage={setCurrentPage}
            />
          </div>
        )}

        {data && data.students.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center gap-1">
              <Info className="h-4 w-4" />
              <span>
                Showing {data.students.length} of {data.totalStudents} students
              </span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}