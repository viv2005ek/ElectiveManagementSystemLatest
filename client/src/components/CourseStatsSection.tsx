import { BookOpen, GraduationCap, Users } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface CourseStats {
  id: string;
  name: string;
  code: string;
  studentCount: number;
}

interface CourseBucketStats {
  id: string;
  name: string;
  studentCount: number;
}

interface CourseStatsSectionProps {
  courses: CourseStats[];
  courseBuckets: CourseBucketStats[];
  unallottedStudents: number;
  loading: boolean;
  error: Error | null;
}

export default function CourseStatsSection({
  courses,
  courseBuckets,
  unallottedStudents,
  loading,
  error,
}: CourseStatsSectionProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Course Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <Skeleton height={20} width="60%" className="mb-2" />
              <Skeleton height={30} width="40%" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Course Statistics
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Error loading course statistics.</p>
        </div>
      </div>
    );
  }

  const totalStudents =
    courses.reduce((acc, course) => acc + course.studentCount, 0) +
    courseBuckets.reduce((acc, bucket) => acc + bucket.studentCount, 0) +
    unallottedStudents;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Course Statistics
      </h3>

      {/* Course Offerings */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-blue-50 rounded-lg p-4 border border-blue-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">{course.name}</h4>
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  {course.code}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-semibold">
                  {course.studentCount} students
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Course Buckets */}
        {courseBuckets.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              Course Buckets
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseBuckets.map((bucket) => (
                <div
                  key={bucket.id}
                  className="bg-purple-50 rounded-lg p-4 border border-purple-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium text-purple-900">
                        {bucket.name}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-700 font-semibold">
                      {bucket.studentCount} students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unallotted Students */}
        {unallottedStudents > 0 && (
          <div className="mt-6">
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-900">
                    Pending Allotments
                  </h4>
                </div>
                <span className="text-yellow-700 font-semibold">
                  {unallottedStudents} students
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}