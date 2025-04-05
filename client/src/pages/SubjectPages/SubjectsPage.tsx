import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetchSubjects from "../../hooks/subjectHooks/useFetchSubjects.ts";
import "react-loading-skeleton/dist/skeleton.css";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import SubjectsTable from "../../components/tables/SubjectsTable.tsx";

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { subjects, loading, totalPages, refresh } = useFetchSubjects({
    search: searchQuery,
    page: currentPage,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHeader title={"Subjects"} />
        <div
          className={"mt-6 w-full items-center flex-row justify-between flex"}
        >
          <SearchBarWithDebounce
            value={searchQuery}
            setValue={setSearchQuery}
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
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <SubjectsTable
              refresh={refresh}
              subjects={subjects}
              loading={loading}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
