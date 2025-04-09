import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { AlertCircle, Clock, RefreshCw } from "lucide-react";
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

dayjs.extend(relativeTime);

const tabs: Tab[] = [
  { name: "All", current: true, value: "" },
  { name: "Completed", current: true, value: "filled" },
  { name: "Pending", current: false, value: "not-filled" },
];

export default function SubjectPreferencesPage() {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAllDetails, setShowAllDetails] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].name);

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

  const renderSubjectHeader = () =>
    infoLoading ? (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500 mt-6">
        <Skeleton height={28} width={240} />
        <div className="mt-3 flex gap-3">
          <Skeleton height={24} width={100} />
          <Skeleton height={24} width={100} />
          <Skeleton height={24} width={100} />
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500 mt-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {subjectInfo?.name}
            </h2>
            <div className="flex flex-wrap mt-3 gap-3">
              <div className="flex items-center">
                <span className="font-semibold mr-2 text-gray-600">
                  Batch Year:
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-medium">
                  {subjectInfo?.batch.year}
                </span>
              </div>
              {subjectInfo?.dueDate && (
                <div className="flex items-center">
                  <span className="font-semibold mr-2 text-gray-600">
                    Due Date:
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md font-medium">
                    {dayjs(subjectInfo.dueDate).format("D MMMM YYYY")}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <span className="font-semibold mr-2 text-gray-600">Type:</span>
                <span
                  className={`px-3 py-1 rounded-md font-medium ${
                    subjectInfo?.subjectType.allotmentType === "Standalone"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {subjectInfo?.subjectType.name}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {subjectInfo?.dueDate &&
              dayjs(subjectInfo?.dueDate).isAfter(dayjs()) && (
                <div className="text-sm flex items-center justify-end">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="text-gray-600 font-medium mr-2">
                    Time Remaining:
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md font-medium">
                    {dayjs(subjectInfo.dueDate).fromNow(true)}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <PageHeader title="Subject Preferences" />

        {renderSubjectHeader()}

        {/* Search and Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <SearchBarWithDebounce value={search} setValue={setSearch} />
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={fetchPreferences}
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
              } text-white flex items-center gap-2`}
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

        <Tabs tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />

        <div className={"w-full border-1 mb-12"} />

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
              className="px-4 py-2 bg-white border border-red-300 rounded-md text-red-600 hover:bg-red-50 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : data ? (
          <div className="space-y-4">
            {data.students.map((student, index) => (
              <StudentPreferenceCard
                student={student}
                index={index + 1}
                allotmentType={subjectInfo?.subjectType.allotmentType}
              />
            ))}
          </div>
        ) : null}
        <PaginationFooter
          totalPages={data?.totalPages ?? 1}
          currentPage={currentPage}
          setPage={setCurrentPage}
        />
      </div>
    </MainLayout>
  );
}
