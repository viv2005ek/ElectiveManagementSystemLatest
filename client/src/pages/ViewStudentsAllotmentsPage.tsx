import MainLayout from "../layouts/MainLayout.tsx";
import { useStudentAllotments } from "../hooks/subjectHooks/useStudentAllotments.ts";
import PageHeader from "../components/PageHeader.tsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Define the AllotmentStatus enum locally since we can't import it from @prisma/client on the client side
enum AllotmentStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
}

export default function ViewStudentsAllotmentsPage() {
  const { allotments, loading, error } = useStudentAllotments();

  // Helper function to get semester information
  const getSemesterInfo = (allotment: any) => {
    // For bucket allotments, semester is directly available
    if (allotment.semester) {
      return allotment.semester.number;
    }

    // For standalone allotments, check subject's semester or semesters
    if (allotment.subject?.semester) {
      return allotment.subject.semester.number;
    }

    if (allotment.subject?.semesters && allotment.subject.semesters.length > 0) {
      // If multiple semesters, show the first one
      return allotment.subject.semesters[0].number;
    }

    return "N/A";
  };

  // Safe course display function
  const getCourseDisplay = (allotment: any) => {
    if (!allotment.course) {
      return "Course information not available";
    }
    
    const code = allotment.course.code || "N/A";
    const name = allotment.course.name || "Unnamed Course";
    return `${code} - ${name}`;
  };

  // Safe department display function
  const getDepartmentDisplay = (allotment: any) => {
    if (!allotment.course?.department) {
      return "Department not assigned";
    }
    return allotment.course.department.name || "Unnamed Department";
  };

  // Safe credits display function
  const getCreditsDisplay = (allotment: any) => {
    if (!allotment.course) {
      return "N/A";
    }
    return allotment.course.credits ?? "N/A";
  };

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader
          title="My Allotments"
          description="View all your course allotments for the current semester"
        />

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="mt-6">
            <Skeleton height={40} count={5} className="mb-2" />
            <Skeleton height={60} count={3} className="mb-2" />
          </div>
        ) : (
          allotments && (
            <div className="mt-6 space-y-8">
              {/* Standalone Allotments */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-orange-50 border-b border-orange-100">
                  <h2 className="text-lg font-medium text-gray-900">
                    Standalone Course Allotments
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Individual course allotments for your subjects
                  </p>
                </div>

                {allotments.standaloneAllotments.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    No standalone course allotments found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Subject
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Course
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Department
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Credits
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Semester
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allotments.standaloneAllotments.map((allotment) => (
                          <tr key={allotment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {allotment.subject?.name || "Subject not available"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getCourseDisplay(allotment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getDepartmentDisplay(allotment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getCreditsDisplay(allotment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getSemesterInfo(allotment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  allotment.allotmentStatus ===
                                  AllotmentStatus.Confirmed
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {allotment.allotmentStatus || "Unknown"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Bucket Allotments */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-orange-50 border-b border-orange-100">
                  <h2 className="text-lg font-medium text-gray-900">
                    Bucket Course Allotments
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Course bucket allotments for your subjects
                  </p>
                </div>

                {allotments.bucketAllotments.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    No bucket course allotments found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Subject
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Course Bucket
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Allotted Course
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Department
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Credits
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Semester
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allotments.bucketAllotments.map((allotment) => (
                          <tr key={allotment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {allotment.subject?.name || "Subject not available"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {allotment.courseBucket?.name || "Bucket not available"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getCourseDisplay(allotment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getDepartmentDisplay(allotment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getCreditsDisplay(allotment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getSemesterInfo(allotment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  allotment.allotmentStatus ===
                                  AllotmentStatus.Confirmed
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {allotment.allotmentStatus || "Unknown"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}