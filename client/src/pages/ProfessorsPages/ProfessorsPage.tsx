import MainLayout from "../../layouts/MainLayout.tsx";
import useFetchProfessors from "../../hooks/professorHooks/useFetchProfessors.ts";
import ProfessorsTable from "../../components/tables/ProfessorsTable.tsx";
import { useState } from "react";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { Link } from "react-router-dom";

export default function ProfessorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { professors, totalPages, loading } = useFetchProfessors({
    search: searchQuery,
    page: currentPage,
  });

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title="Professors" />

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          </div>

          <div className="flex justify-between mb-4">
            <SearchBarWithDebounce
              value={searchQuery}
              setValue={setSearchQuery}
              placeholder="Search by name or registration number"
            />
            <Link
              to="/professors/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Professor
            </Link>
          </div>

          <ProfessorsTable
            professors={professors}
            isLoading={loading}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            label="Professor List"
          />
        </div>
      </div>
    </MainLayout>
  );
}
