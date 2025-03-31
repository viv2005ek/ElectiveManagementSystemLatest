import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import useFetchCourseBuckets from "../hooks/courseBucketHooks/useFetchCourseBuckets.ts";
import CourseBucketsTable from "../components/tables/CourseBucketsTable.tsx";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CourseBucketsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, totalPages, loading } = useFetchCourseBuckets({});

  return (
    <MainLayout>
      <div className={"mt-8"}>
        <PageHeader title={"Course Buckets"} />
        <div className={""}>
          <div className={"mt-4 flex justify-end"}>
            <Link to={"/course-buckets/create"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Add Course Bucket
              </button>
            </Link>
          </div>

          <CourseBucketsTable
            buckets={data}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
}
