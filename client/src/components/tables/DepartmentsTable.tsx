import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Department } from "../../hooks/departmentHooks/useFetchDepartments.ts";

export default function DepartmentsTable({
  departments,
  loading,
}: {
  departments: Department[] | null;
  loading: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    S.no
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    School
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-right text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-right text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-right text-sm">
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  : departments?.map((department, index) => (
                      <tr
                        key={department.id}
                        className={"hover:bg-gray-100 cursor-auto"}
                      >
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap font-semibold py-4 font px-4 text-sm text-gray-900">
                          {department.name}
                        </td>
                        <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                          {department.school.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                            <span className="sr-only">, {department.name}</span>
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
