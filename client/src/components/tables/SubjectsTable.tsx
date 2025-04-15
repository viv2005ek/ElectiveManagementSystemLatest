import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Subject } from "../../hooks/subjectHooks/useFetchSubjects.ts";
import { Dispatch, SetStateAction, useState } from "react";
import PaginationFooter from "../PaginationFooter.tsx";
import SubjectManageModal from "../modals/SubjectManageModal.tsx";
import { Cog6ToothIcon, PencilIcon, ClipboardDocumentListIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function SubjectsTable({
  subjects,
  loading,
  label,
  totalPages = 1,
  currentPage = 1,
  setCurrentPage,
  refresh,
}: {
  subjects: Subject[] | null;
  loading: boolean;
  label?: string;
  totalPages?: number;
  currentPage?: number;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  refresh?: () => void;
}) {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const openManageModal = (subject: Subject, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSubject(subject);
    setIsManageModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {label && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">{label}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                S.no
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Batch
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                  </tr>
                ))
              : subjects?.map((subject, index) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => navigate(`/subjects/${subject.id}`)}
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {subject.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {subject.batch.year}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        subject.isAllotmentFinalized 
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                          : subject.isPreferenceWindowOpen 
                            ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' 
                            : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
                      }`}>
                        {subject.isAllotmentFinalized 
                          ? 'Finalized' 
                          : subject.isPreferenceWindowOpen 
                            ? 'Open' 
                            : 'Closed'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-sm">
                      <div className="flex flex-row justify-end gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/subjects/${subject.id}/preferences`);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150 inline-flex items-center gap-1"
                        >
                          <ClipboardDocumentCheckIcon className="h-4 w-4" />
                          Preferences
                          <span className="sr-only">, {subject.name}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/subjects/${subject.id}/allotments`);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150 inline-flex items-center gap-1"
                        >
                          <ClipboardDocumentListIcon className="h-4 w-4" />
                          Allotments
                          <span className="sr-only">, {subject.name}</span>
                        </button>
                        <button
                          onClick={(e) => openManageModal(subject, e)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150 inline-flex items-center gap-1"
                        >
                          <Cog6ToothIcon className="h-4 w-4" />
                          Manage
                          <span className="sr-only">, {subject.name}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/subjects/${subject.id}/edit`);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 inline-flex items-center gap-1"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                          <span className="sr-only">, {subject.name}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && setCurrentPage && (
        <div className="px-6 py-4 border-t border-gray-200">
          <PaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        </div>
      )}
      <SubjectManageModal
        open={isManageModalOpen}
        setOpen={setIsManageModalOpen}
        subject={selectedSubject}
        refresh={refresh || (() => {})}
      />
    </div>
  );
}
