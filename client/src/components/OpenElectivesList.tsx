import { electives } from '../data.ts';


export default function OpenElectivesList() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Open Elective VI</h1>
          <p className="mt-2 text-sm text-gray-700">
            Choose an Open Elective for Semester 6
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                >
                  Course name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  Course code
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  Faculty
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  Total Seats
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  Remaining Seats
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {electives.map((elective) => (
                <tr key={elective.courseCode}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elective.courseName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elective.courseCode}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elective.faculty}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elective.totalSeats}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elective.remainingSeats}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <input type="checkbox" className={'h-5 w-5 rounded-full'} />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
