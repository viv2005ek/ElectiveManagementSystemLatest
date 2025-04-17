import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import FacultiesTable from "../../components/tables/FacultiesTable.tsx";
import useFetchFaculties from "../../hooks/facultyHooks/useFetchFaculties.ts";
import { Link } from "react-router-dom";

export default function FacultiesPage() {
  const { faculties, loading } = useFetchFaculties();
  return (
    <MainLayout>
      <div className={"py-8"}>
        <PageHeader title={"Faculties"} />
        <div className={""}>
          <div className={"flex flex-row items-center my-6 justify-end"}>
            <Link to={"/faculties/create"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Add Faculty
              </button>
            </Link>
          </div>
          <FacultiesTable faculties={faculties} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
}
