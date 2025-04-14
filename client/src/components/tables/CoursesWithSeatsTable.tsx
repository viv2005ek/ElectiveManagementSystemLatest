import { useNavigate } from "react-router-dom";
import React, { Dispatch } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CourseWithSeats } from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";

export default function CoursesWithSeatsTable({
  coursesWithSeats,
  isLoading,
}: {
  coursesWithSeats: CourseWithSeats[] | null;
  isLoading: boolean;
  selectedCoursesWithSeats?: CourseWithSeats[];
  setSelectedCoursesWithSeats?: Dispatch<CourseWithSeats[]>;
}) {
  const navigate = useNavigate();

  // const handleSelection = (
  //   e: MouseEvent<HTMLButtonElement>,
  //   course: Course,
  // ) => {
  //   e.stopPropagation();
  //   if (selectedCoursesWithSeats && setSelectedCoursesWithSeats) {
  //     setSelectedCoursesWithSeats([...selectedCoursesWithSeats, course]);
  //   }
  // };

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
                  ></th>
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
                        <td className="whitespace-nowrap py-4 px-4 text-sm">
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  : coursesWithSeats?.map((courseWithSeats) => (
                      <tr
                        onClick={() =>
                          navigate(`/courses/${courseWithSeats.course.id}`)
                        }
                        key={courseWithSeats.course.id}
                        className="hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {courseWithSeats.course.code}
                        </td>
                        <td className="whitespace-nowrap font-semibold py-4 px-4 text-sm text-gray-900">
                          {courseWithSeats.course.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {courseWithSeats.course.credits}
                        </td>
                        <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-900">
                          {courseWithSeats.course.department.name}
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
