import MainLayout from "../../layouts/MainLayout.tsx";
import {
  Program,
  useFetchPrograms,
} from "../../hooks/programHooks/useFetchPrograms.ts";
import SearchBarWithoutDebounce from "../../components/SearchBarWithoutDebounce.tsx";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader.tsx";
import { Link } from "react-router-dom";
import ProgramsTable from "../../components/tables/ProgramsTable.tsx";

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const { programs, loading, error } = useFetchPrograms();

  useEffect(() => {
    if (!loading && Array.isArray(programs)) {
      const filtered = searchQuery.trim()
        ? programs.filter((program) =>
            program.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : programs;
      setFilteredPrograms(filtered);
    }
  }, [programs, searchQuery, loading]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <PageHeader title="Programs" />
          <Link
            to="/programs/create"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Program
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Program List
              </h3>
              <div className="mt-4 md:mt-0 w-full md:w-64">
                <SearchBarWithoutDebounce
                  value={searchQuery}
                  setValue={setSearchQuery}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <ProgramsTable
              programs={filteredPrograms}
              loading={loading}
              label={"All Programs"}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
