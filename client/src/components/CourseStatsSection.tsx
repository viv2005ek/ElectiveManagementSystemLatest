import { BookOpen, GraduationCap, Users, Play, AlertTriangle } from "lucide-react";
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
  onRunPendingAllotments?: () => void;
  isRunningPendingAllotments?: boolean;
  subjectId?: string;
}

export default function CourseStatsSection({
  courses,
  courseBuckets,
  unallottedStudents,
  loading,
  error,
  onRunPendingAllotments,
  isRunningPendingAllotments = false,
  subjectId,
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Course Statistics
        </h3>
        
        {/* Run Pending Allotments Button */}
        {unallottedStudents > 0 && onRunPendingAllotments && (
          <button
            onClick={onRunPendingAllotments}
            disabled={isRunningPendingAllotments}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Play className={`h-4 w-4 ${isRunningPendingAllotments ? "animate-spin" : ""}`} />
            <span>
              {isRunningPendingAllotments 
                ? "Running..." 
                : `Run Pending Allotments (${unallottedStudents})`
              }
            </span>
          </button>
        )}
      </div>

      {/* Warning Message */}
      {unallottedStudents > 0 && onRunPendingAllotments && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium mb-1">
                Pending Allotments Available
              </p>
              <p className="text-yellow-700 text-sm">
                {unallottedStudents} students haven't been allotted. Click "Run Pending Allotments" 
                to automatically assign them to courses based on available seats. Students will be 
                distributed to fill courses with the least selections first.
              </p>
              <p className="text-yellow-600 text-xs mt-2 font-medium">
                Note: This will assign students who didn't fill preferences to available courses.
              </p>
            </div>
          </div>
        </div>
      )}

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
                  <div>
                    <h4 className="font-medium text-yellow-900">
                      Pending Allotments
                    </h4>
                    <p className="text-yellow-700 text-sm">
                      Students who didn't fill preferences
                    </p>
                  </div>
                </div>
                <span className="text-yellow-700 font-semibold text-lg">
                  {unallottedStudents} students
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Total Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total Students in Subject:</span>
            <span className="text-lg font-bold text-gray-900">{totalStudents}</span>
          </div>
        </div>
      </div>
    </div>
  );
}