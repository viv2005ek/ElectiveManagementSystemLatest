import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import CoursesTable from "../components/tables/CoursesTable.tsx";
import useFetchCourses from "../hooks/courseHooks/useFetchCourses.ts";
import {useState} from "react";
import SearchBarWithDebounce from "../components/SearchBarWithDebounce.tsx";
import {Link} from "react-router-dom";

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { courses, totalPages, loading } = useFetchCourses({
    page: currentPage,
    search: searchQuery,
  });

  return (
    <MainLayout>
      <div className={"py-8"}>
        <PageHeader title={"Courses"} />
        <div className={"flex flex-row my-8 items-center justify-center"}>
          <div className={"flex flex-row gap-4 items-end"}>
            <SearchBarWithDebounce
              value={searchQuery}
              setValue={setSearchQuery}
            />
            {/*<SingleSelectFilterForIds*/}
            {/*  name={"Branch"}*/}
            {/*  items={branches}*/}
            {/*  selected={branch}*/}
            {/*  setSelected={setBranch}*/}
            {/*/>*/}
            {/*<SingleSelectFilterForNumbers*/}
            {/*  name={"Semesters"}*/}
            {/*  items={semesters}*/}
            {/*  selected={semester}*/}
            {/*  setSelected={setSemester}*/}
            {/*/>*/}
            {/*<SingleSelectFilterForNumbers*/}
            {/*  name={"Batches"}*/}
            {/*  items={batches}*/}
            {/*  selected={batch}*/}
            {/*  setSelected={setBatch}*/}
            {/*/>*/}
          </div>
          <div className={"flex flex-row flex-grow justify-end"}>
            <Link to={"/courses/create"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Add Course
              </button>
            </Link>
          </div>
        </div>
        <CoursesTable
          courses={courses}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoading={loading}
        />
      </div>
    </MainLayout>
  );
}
