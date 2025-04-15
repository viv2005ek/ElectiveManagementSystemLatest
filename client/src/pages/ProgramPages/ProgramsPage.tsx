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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <PageHeader title="Programs" />
          <Link 
            to="/programs/create"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Program
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-lg font-medium text-gray-900">Program List</h3>
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
              programs={programs} 
              loading={loading} 
              label="All Programs"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
