import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBarWithoutDebounce from "../../components/SearchBarWithoutDebounce.tsx";
import { useFetchPrograms } from "../../hooks/programHooks/useFetchPrograms.ts";
import ProgramsTable from "../../components/tables/ProgramsTable.tsx";

export default function ProgramsPage() {
  const { programs, loading } = useFetchPrograms();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter departments based on searchQuery (case-insensitive)

  return (
    <MainLayout>
      <div className={"py-8"}>
        <PageHeader title={"Programs"} />
        <div>
          <div className={"flex flex-row items-center mt-4 justify-end"}>
            <div className={"flex flex-grow"}>
              <SearchBarWithoutDebounce
                value={searchQuery}
                setValue={setSearchQuery}
              />
            </div>
            <Link to={"/programs/create"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Add Program
              </button>
            </Link>
          </div>

          <ProgramsTable programs={programs} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
}
