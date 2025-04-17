import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import SchoolsTable from "../../components/tables/SchoolsTable.tsx";
import useFetchSchools from "../../hooks/schoolHooks/useFetchSchools.ts";
import { Link } from "react-router-dom";

export default function SchoolsPage() {
  const { schools, loading } = useFetchSchools();

  return (
    <MainLayout>
      <div className={"py-8"}>
        <PageHeader title={"Schools"} />
        <div className={""}>
          <div className={"flex flex-row items-center my-6 justify-end"}>
            <Link to={"/schools/create"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Add School
              </button>
            </Link>
          </div>
          <SchoolsTable schools={schools} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
}
