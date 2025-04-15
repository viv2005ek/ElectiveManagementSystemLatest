import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetchSubjects from "../../hooks/subjectHooks/useFetchSubjects.ts";
import "react-loading-skeleton/dist/skeleton.css";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import SubjectsTable from "../../components/tables/SubjectsTable.tsx";
import Tabs, { Tab } from "../../components/Tabs.tsx";

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Ongoing");

  // Define tabs
  const tabs: Tab[] = [
    { name: "Ongoing", current: activeTab === "Ongoing" },
    { name: "Finalized", current: activeTab === "Finalized" },
  ];

  // Fetch subjects based on the active tab
  const { subjects, loading, totalPages, refresh } = useFetchSubjects({
    search: searchQuery,
    page: currentPage,
    isAllotmentFinalized: activeTab === "Finalized",
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title={"Subjects"} />

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="mb-4 sm:mb-0"
              />
              <Link to={"/subjects/create"}>
                <button
                  type="button"
                  className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  Create Subject
                </button>
              </Link>
            </div>

            <div className="mt-4">
              <SearchBarWithDebounce
                value={searchQuery}
                setValue={setSearchQuery}
                placeholder="Search subjects by name"
              />
            </div>
          </div>

          <SubjectsTable
            refresh={refresh}
            subjects={subjects}
            loading={loading}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            label={`${activeTab} Subjects`}
          />
        </div>
      </div>
    </MainLayout>
  );
}
