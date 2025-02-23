import MainLayout from '../layouts/MainLayout.tsx';
import PageHeader from '../components/PageHeader.tsx';
import useFetchDepartments from '../hooks/departmentHooks/useFetchDepartments.ts';
import DepartmentsTable from '../components/tables/DepartmentsTable.tsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBarWithoutDebounce from '../components/SearchBarWithoutDebounce.tsx';

export default function DepartmentsPage() {
  const { departments, loading } = useFetchDepartments();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter departments based on searchQuery (case-insensitive)
  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Departments"} />
        <div>
          <div className={"flex flex-row items-center mt-4 justify-end"}>
            <div className={"flex flex-grow"}>
              <SearchBarWithoutDebounce
                value={searchQuery}
                setValue={setSearchQuery}
              />
            </div>
            <Link to={"/departments/create"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Add Department
              </button>
            </Link>
          </div>

          <DepartmentsTable
            departments={filteredDepartments}
            loading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
}
