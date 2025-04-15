import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/PageHeader';
import useFetchSubjectTypes, { SubjectType } from '../../hooks/subjectTypeHooks/useFetchSubjectTypes';
import { useDeleteSubjectType } from '../../hooks/subjectTypeHooks/useDeleteSubjectType';
import { PlusIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SubjectTypesPage = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubjectType, setSelectedSubjectType] = useState<SubjectType | null>(null);
  const { subjectTypes, loading: isLoading, error, refetch } = useFetchSubjectTypes();
  const { deleteSubjectType } = useDeleteSubjectType();

  const handleDelete = (subjectType: SubjectType) => {
    setSelectedSubjectType(subjectType);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSubjectType) {
      await deleteSubjectType(selectedSubjectType.id);
      setIsDeleteModalOpen(false);
      setSelectedSubjectType(null);
      refetch();
    }
  };

  // Function to truncate text
  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Subject Types</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage subject types for your courses
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/subjects/types/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Subject Type
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="py-2">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {isLoading ? (
                      <>
                        {[...Array(5)].map((_, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <Skeleton width={120} />
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">
                              <Skeleton width={200} />
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex justify-end space-x-4">
                                <Skeleton width={40} />
                                <Skeleton width={40} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : error ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-sm text-red-500 text-center">
                          {error}
                        </td>
                      </tr>
                    ) : subjectTypes.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-sm text-gray-500 text-center">
                          No subject types found
                        </td>
                      </tr>
                    ) : (
                      subjectTypes.map((subjectType: SubjectType) => (
                        <tr key={subjectType.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {subjectType.name}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <div className="group relative">
                              <span className="inline-block max-w-xs">
                                {truncateText(subjectType.description)}
                              </span>
                              {subjectType.description && subjectType.description.length > 50 && (
                                <div className="absolute z-10 w-64 p-2 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
                                  <div className="flex items-start">
                                    <InformationCircleIcon className="h-4 w-4 text-indigo-500 mr-1 mt-0.5 flex-shrink-0" />
                                    <span>{subjectType.description}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              to={`/subjects/types/${subjectType.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(subjectType)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedSubjectType && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Subject Type
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the subject type "{selectedSubjectType.name}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default SubjectTypesPage; 