import Skeleton from "react-loading-skeleton";
import {Dispatch, SetStateAction, useEffect} from "react";
import {Course} from "../../hooks/courseHooks/useFetchCourses.ts";
import {CourseWithOrder} from "../../pages/CreateCourseBucketPage.tsx";

export default function CoursesMultiSelectTable({
  courses,
  selectedCourses,
  setSelectedCourses,
  isLoading,
  maxSelection,
}: {
  courses: Course[];
  selectedCourses: CourseWithOrder[];
  setSelectedCourses: Dispatch<SetStateAction<CourseWithOrder[]>>;
  isLoading: boolean;
  maxSelection?: number;
}) {
  const toggleSelect = (course: Course) => {
    setSelectedCourses((prevSelected) => {
      const existingIndex = prevSelected.findIndex((c) => c.id === course.id);

      if (existingIndex !== -1) {
        // Remove the course and update order indices
        return prevSelected
          .filter((_, index) => index !== existingIndex)
          .map((c, index) => ({ ...c, orderIndex: index + 1 }));
      } else {
        if (maxSelection && prevSelected.length >= maxSelection) {
          const newSelection = prevSelected
            .slice(1)
            .map((c, index) => ({ ...c, orderIndex: index + 1 }));
          return [
            ...newSelection,
            { id: course.id, orderIndex: newSelection.length + 1 },
          ];
        }
        return [
          ...prevSelected,
          { id: course.id, orderIndex: prevSelected.length + 1 },
        ];
      }
    });
  };

  const isSelected = (course: Course) =>
    selectedCourses.some((c) => c.id === course.id);
  const getSelectionIndex = (course: Course) =>
    selectedCourses.find((c) => c.id === course.id)?.orderIndex;

  useEffect(() => {
    setSelectedCourses([]);
  }, [maxSelection]);

  return (
    <div className="mt-6">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    #
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Course code
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Credits
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Department
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                    Categories
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <td key={i} className="py-4 px-4">
                            <Skeleton />
                          </td>
                        ))}
                      </tr>
                    ))
                  : courses?.map((course) => (
                      <tr
                        key={course.id}
                        className={`hover:bg-gray-100 cursor-pointer ${isSelected(course) ? "bg-blue-100" : ""}`}
                        onClick={() => toggleSelect(course)}
                      >
                        <td className="py-4 px-4 flex items-center justify-center flex-col gap-2">
                          {isSelected(course) && (
                            <div className="text-sm text-white font-semibold bg-blue-500 rounded-full p-1 flex w-5 h-5 items-center justify-center text-center">
                              {getSelectionIndex(course)}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.code}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.credits}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {course.department.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm flex flex-col text-gray-900 gap-0.5">
                          {course.subjectTypes?.length > 0 ? (
                            course.subjectTypes.map((type) => (
                              <div
                                key={type.id}
                                className="text-xs bg-blue-200 text-blue-700 w-min px-1 rounded-full"
                              >
                                {type.name}
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              No types added
                            </span>
                          )}
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
