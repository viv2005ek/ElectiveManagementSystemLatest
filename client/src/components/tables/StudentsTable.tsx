import { useNavigate } from 'react-router-dom';
import { Student } from '../../hooks/useFetchStudents.ts';
import { capitalize } from '../../utils/StringUtils.ts';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function StudentsTable({
  students,
}: {
  students: Student[] | null;
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-6">
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
                    Registration no.
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
                    Gender
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Branch
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Semester
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Batch
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
                {students?.map((student, index) => (
                  <tr
                    onClick={() => navigate(`/students/${student.id}`)}
                    key={student.id}
                    className={"hover:bg-gray-100 hover:cursor-pointer"}
                  >
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                      {student.registrationNumber}
                    </td>
                    <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                      {capitalize(student.gender)}
                    </td>
                    <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                      {student.branch.name}
                    </td>
                    <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                      {student.semester}
                    </td>
                    <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                      {student.batch}
                    </td>
                    <td className="whitespace-nowrap py-4 font px-4 text-sm text-gray-900">
                      <div className={"flex flex-row justify-end gap-4"}>
                        <EyeIcon className={"h-6 w-6 stroke-gray-500"} />
                        <PencilIcon className={"h-6 w-6 stroke-gray-500"} />
                      </div>
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
