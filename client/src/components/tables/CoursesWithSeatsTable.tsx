import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CourseWithSeats } from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Course } from "../../hooks/courseHooks/useFetchCourses.ts";
import { PlusIcon } from "lucide-react";
import SingleSelectMenuVoid from "../FormComponents/SingleSelectMenuVoid.tsx";

export default function CoursesWithSeatsTable({
  coursesWithSeats,
  setCoursesWithSeats,
  isLoading,
  viewMode = true,
  courses,
  label,
}: {
  coursesWithSeats: CourseWithSeats[] | null;
  setCoursesWithSeats: (courses: CourseWithSeats[]) => void;
  isLoading: boolean;
  viewMode?: boolean;
  courses: Course[];
  label?: string;
}) {
  const handleAddRow = () => {
    setCoursesWithSeats([
      ...(coursesWithSeats || []),
      {
        course: {
          id: "", // Empty ID for new rows
          code: "",
          name: "",
          credits: 0,
          department: { id: "", name: "", schoolId: "" },
        },
        totalSeats: 0,
      },
    ]);
  };

  const handleCourseChange = (index: number, selectedCourse: Course) => {
    if (!coursesWithSeats) return;

    const updatedCourses = [...coursesWithSeats];
    updatedCourses[index] = {
      ...updatedCourses[index],
      course: selectedCourse,
    };

    setCoursesWithSeats(updatedCourses);
  };

  const handleSeatsChange = (index: number, newSeats: number) => {
    if (!coursesWithSeats) return;

    // Ensure seats is a non-negative number
    const validatedSeats = Math.max(0, newSeats);

    const updatedCourses = [...coursesWithSeats];
    updatedCourses[index] = {
      ...updatedCourses[index],
      totalSeats: validatedSeats,
    };

    setCoursesWithSeats(updatedCourses);
  };

  const handleDelete = (index: number) => {
    if (!coursesWithSeats) return;

    const updatedCourses = coursesWithSeats.filter((_, i) => i !== index);
    setCoursesWithSeats(updatedCourses);
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                Course code
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
                Credits
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Seats
              </th>
              {!viewMode && (
                <th
                  scope="col"
                  className="py-3.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
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
                    <td className="py-4 px-4 text-sm">
                      <Skeleton />
                    </td>
                  </tr>
                ))
              : coursesWithSeats?.map((courseWithSeats, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {courseWithSeats.course.code}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {!viewMode ? (
                        <SingleSelectMenuVoid
                          items={courses}
                          selected={courseWithSeats.course}
                          setSelected={(selectedCourse) => {
                            handleCourseChange(index, selectedCourse);
                          }}
                        />
                      ) : (
                        <span className="font-medium">
                          {courseWithSeats.course.name}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {courseWithSeats.course.credits}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {courseWithSeats.course.department.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {!viewMode ? (
                        <input
                          type="number"
                          min="0"
                          className="w-20 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                          value={courseWithSeats.totalSeats ?? 0}
                          onChange={(e) =>
                            handleSeatsChange(
                              index,
                              parseInt(e.target.value, 10) || 0,
                            )
                          }
                        />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {courseWithSeats.totalSeats ?? "No limit"}
                        </span>
                      )}
                    </td>
                    {!viewMode && (
                      <td className="py-4 px-4 text-sm text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                          title="Delete course"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!viewMode && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleAddRow}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Course
          </button>
        </div>
      )}
    </div>
  );
}
