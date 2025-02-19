import { Link, useNavigate } from "react-router-dom";
import { Branch } from "../../hooks/useBranches.ts";
import Skeleton from "react-loading-skeleton";

export default function BranchesTable({
  branches,
  loading,
}: {
  branches: Branch[] | null;
  loading: boolean;
}) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6">
      <div className="sm:flex sm:items-center">
        <div className="flex justify-end w-full">
          <Link to={"/branches/create"}>
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Add branch
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    S.no
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Department
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading
                  ? [...Array(8)].map((_, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-right text-sm font-medium">
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  : branches?.map((branch, index) => (
                      <tr
                        key={branch.id}
                        className="hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {branch.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {branch.department.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </a>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
