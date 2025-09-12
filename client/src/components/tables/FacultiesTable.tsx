import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Faculty } from "../../hooks/facultyHooks/useFetchFaculties.ts";

export default function FacultiesTable({
  faculties,
  loading,
  label,
}: {
  faculties: Faculty[] | null;
  loading: boolean;
  label?: string;
}) {
  const navigate = useNavigate();
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
                  </tr>
                ))
              : faculties?.map((faculty, index) => (
                  <tr
                    key={faculty.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => navigate(`/faculties/${faculty.id}`)}
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {faculty.name}
                    </td>
                    <td className="py-4 px-4 text-right text-sm">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/faculties/${faculty.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                        >
                          View
                          <span className="sr-only">, {faculty.name}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
