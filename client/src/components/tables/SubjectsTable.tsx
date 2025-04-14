import Skeleton from "react-loading-skeleton";
import PaginationFooter from "../PaginationFooter.tsx";
import { Subject } from "../../hooks/subjectHooks/useFetchSubjects.ts";
import { Link } from "react-router-dom";
import { useState } from "react";
import SubjectManageModal from "../modals/SubjectManageModal.tsx";

export default function SubjectsTable({
  subjects,
  refresh,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
}: {
  subjects: Subject[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  refresh: () => void;
  setCurrentPage: (page: number) => void;
}) {
  const [showManageModal, setShowManageModal] = useState<boolean>(false);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleModal = (subject: Subject) => {
    setActiveSubject(subject);
    setShowManageModal(true);
  };

  return (
    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              Subject Name
            </th>
            <th
              scope="col"
              className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              Batch
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Preferences filled out by
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Preference window status
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Allotment Status
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Preferences
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Allotments
            </th>
            <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="even:bg-gray-50">
                  <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                    <Skeleton />
                  </td>
                  <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    <Skeleton />
                  </td>
                  <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    <Skeleton />
                  </td>
                  <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    <Skeleton />
                  </td>
                  <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                    <Skeleton />
                  </td>
                  <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                    <Skeleton />
                  </td>
                  <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                    <Skeleton />
                  </td>
                </tr>
              ))
            : subjects?.map((subject) => (
                <tr
                  onClick={() => handleModal(subject)}
                  key={subject.id}
                  className="even:bg-gray-50 hover:bg-gray-200"
                >
                  <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                    <Link
                      to={`/subjects/${subject.id}`}
                      className={"text-blue-800 underline font-semibold"}
                    >
                      {subject.name}
                    </Link>
                  </td>
                  <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                    {subject.batch.year}
                  </td>
                  <td className="px-3 py-4 text-sm whitespace-nowrap text-center text-gray-500">
                    {subject.preferencesFilled} out of {subject.totalStudents}
                  </td>
                  <td className="px-3 py-4 text-sm flex items-center justify-center whitespace-nowrap text-gray-500">
                    {subject.isPreferenceWindowOpen ? (
                      <div
                        className={
                          "text-xs px-2 rounded-full text-center flex w-min bg-green-200 text-green-800"
                        }
                      >
                        Open
                      </div>
                    ) : (
                      <div
                        className={
                          "text-xs px-2 rounded-full text-center flex w-min bg-red-200 text-red-800"
                        }
                      >
                        Closed
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm  whitespace-nowrap text-gray-500">
                    {subject.isAllotmentFinalized ? (
                      <div
                        className={
                          "text-xs px-2 rounded-full text-center flex w-min bg-green-200 text-green-800"
                        }
                      >
                        Finalized
                      </div>
                    ) : (
                      <div
                        className={
                          "text-xs px-2 rounded-full text-center flex w-min bg-red-200 text-red-800"
                        }
                      >
                        Pending
                      </div>
                    )}
                  </td>
                  <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                    <Link
                      className="text-indigo-600 hover:text-indigo-900"
                      to={`/subjects/${subject.id}/preferences`}
                    >
                      View<span className="sr-only">, {subject.name}</span>
                    </Link>
                  </td>
                  <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                    <Link
                      className="text-indigo-600 hover:text-indigo-900"
                      to={`/subjects/${subject.id}/allotments`}
                    >
                      View<span className="sr-only">, {subject.name}</span>
                    </Link>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      <PaginationFooter
        totalPages={totalPages}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
      <SubjectManageModal
        refresh={refresh}
        open={showManageModal}
        setOpen={setShowManageModal}
        subject={activeSubject}
      />
    </div>
  );
}
