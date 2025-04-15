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
          id: crypto.randomUUID(),
          code: "",
          name: "",
          credits: 0,
          department: { id: "", name: "", schoolId: "" },
        },
        totalSeats: 0,
      },
    ]);
  };

  const handleCourseChange = (courseId: string, selectedCourse: Course) => {
    if (!coursesWithSeats) return;

    const updatedCourses = coursesWithSeats.map((courseWithSeats) =>
      courseWithSeats.course.id === courseId
        ? { ...courseWithSeats, course: selectedCourse }
        : courseWithSeats,
    );

    setCoursesWithSeats(updatedCourses);
  };

  const handleSeatsChange = (courseId: string, newSeats: number) => {
    if (!coursesWithSeats) return;

    const updatedCourses = coursesWithSeats.map((courseWithSeats) =>
      courseWithSeats.course.id === courseId
        ? { ...courseWithSeats, totalSeats: newSeats }
        : courseWithSeats,
    );

    setCoursesWithSeats(updatedCourses);
  };

  const handleDelete = (courseId: string) => {
    if (!coursesWithSeats) return;

    const updatedCourses = coursesWithSeats.filter(
      (courseWithSeats) => courseWithSeats.course.id !== courseId,
    );

    setCoursesWithSeats(updatedCourses);
  };

  return (
    <div className="mt-6">
      {label && (
        <div className={"font-semibold text-sm underline"}>{label}</div>
      )}
      <div className="mt-2 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Course code
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
                    Credits
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    Seats
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-right text-sm font-semibold text-gray-900"
                  >
                    {!viewMode && "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  : coursesWithSeats?.map((courseWithSeats) => (
                      <tr
                        key={courseWithSeats.course.id}
                        className="hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {courseWithSeats.course.code}
                        </td>
                        <td className="whitespace-nowrap font-semibold py-4 px-4 text-sm text-gray-900">
                          {!viewMode ? (
                            <SingleSelectMenuVoid
                              items={courses}
                              selected={courseWithSeats.course}
                              setSelected={(selectedCourse) => {
                                handleCourseChange(
                                  courseWithSeats.course.id,
                                  selectedCourse,
                                );
                              }}
                            />
                          ) : (
                            courseWithSeats.course.name
                          )}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {courseWithSeats.course.credits}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {courseWithSeats.course.department.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {!viewMode ? (
                            <input
                              type="number"
                              className={
                                "ring-1 rounded-lg border-0 outline-0 text-sm"
                              }
                              value={courseWithSeats.totalSeats ?? 0}
                              onChange={(e) =>
                                handleSeatsChange(
                                  courseWithSeats.course.id,
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                            />
                          ) : (
                            (courseWithSeats.totalSeats ?? "No limit")
                          )}
                        </td>
                        {!viewMode && (
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900 flex justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(courseWithSeats.course.id);
                              }}
                              className={
                                "p-1 bg-red-500 rounded-md hover:bg-opacity-80"
                              }
                            >
                              <TrashIcon className={"h-5 w-5 stroke-white"} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
            {!viewMode && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleAddRow}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add Row
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
