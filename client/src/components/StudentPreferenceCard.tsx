import { Student } from "../hooks/subjectPreferenceHooks/useSubjectPreferences.ts";
import { useState } from "react";
import { AllotmentType } from "../hooks/subjectTypeHooks/useFetchSubjectTypes.ts"; // Import the enum
import { ChevronDown, Clock, User } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface StudentPreferenceCardProps {
  student: Student;
  index: number;
  allotmentType?: AllotmentType;
}

// REMOVE the local enum definition - use the imported one instead
// enum AllotmentType {
//   STANDALONE = "STANDALONE",
//   BUCKET = "BUCKET"
// }

export default function StudentPreferenceCard({
  student,
  index,
  allotmentType,
}: StudentPreferenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (hasFilledPreferences && preferencesArray.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const getPreferenceColor = (preferenceNumber: number) => {
    const colors = {
      1: "bg-blue-50 text-blue-700 border-blue-200",
      2: "bg-purple-50 text-purple-700 border-purple-200",
      3: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return (
      colors[preferenceNumber as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  // Check if student has filled preferences based on actual data structure
  const hasFilledPreferences = student.preferences !== null;

  // Transform the nested preferences object into an array for easier rendering
  const getPreferencesArray = () => {
    if (!student.preferences) return [];

    const preferences = [];
    
    // Check for STANDALONE preferences - FIXED: Use imported enum
    if (allotmentType === AllotmentType.STANDALONE) {
      // Check each preference course individually
      if (student.preferences.firstPreferenceCourse && student.preferences.firstPreferenceCourse.id) {
        preferences.push({
          priority: 1,
          course: student.preferences.firstPreferenceCourse,
          createdAt: student.preferences.createdAt
        });
      }
      if (student.preferences.secondPreferenceCourse && student.preferences.secondPreferenceCourse.id) {
        preferences.push({
          priority: 2,
          course: student.preferences.secondPreferenceCourse,
          createdAt: student.preferences.createdAt
        });
      }
      if (student.preferences.thirdPreferenceCourse && student.preferences.thirdPreferenceCourse.id) {
        preferences.push({
          priority: 3,
          course: student.preferences.thirdPreferenceCourse,
          createdAt: student.preferences.createdAt
        });
      }
    } 
    // Check for BUCKET preferences - FIXED: Use imported enum
    else if (allotmentType === AllotmentType.BUCKET) {
      // Check each preference course bucket individually
      if (student.preferences.firstPreferenceCourseBucket && student.preferences.firstPreferenceCourseBucket.id) {
        preferences.push({
          priority: 1,
          courseBucket: student.preferences.firstPreferenceCourseBucket,
          createdAt: student.preferences.createdAt
        });
      }
      if (student.preferences.secondPreferenceCourseBucket && student.preferences.secondPreferenceCourseBucket.id) {
        preferences.push({
          priority: 2,
          courseBucket: student.preferences.secondPreferenceCourseBucket,
          createdAt: student.preferences.createdAt
        });
      }
      if (student.preferences.thirdPreferenceCourseBucket && student.preferences.thirdPreferenceCourseBucket.id) {
        preferences.push({
          priority: 3,
          courseBucket: student.preferences.thirdPreferenceCourseBucket,
          createdAt: student.preferences.createdAt
        });
      }
    }
    // If allotmentType is not specified, try to detect it
    else {
      // Check if it's standalone by looking for course preferences
      if (student.preferences.firstPreferenceCourse || student.preferences.secondPreferenceCourse || student.preferences.thirdPreferenceCourse) {
        if (student.preferences.firstPreferenceCourse && student.preferences.firstPreferenceCourse.id) {
          preferences.push({
            priority: 1,
            course: student.preferences.firstPreferenceCourse,
            createdAt: student.preferences.createdAt
          });
        }
        if (student.preferences.secondPreferenceCourse && student.preferences.secondPreferenceCourse.id) {
          preferences.push({
            priority: 2,
            course: student.preferences.secondPreferenceCourse,
            createdAt: student.preferences.createdAt
          });
        }
        if (student.preferences.thirdPreferenceCourse && student.preferences.thirdPreferenceCourse.id) {
          preferences.push({
            priority: 3,
            course: student.preferences.thirdPreferenceCourse,
            createdAt: student.preferences.createdAt
          });
        }
      }
      // Check if it's bucket by looking for bucket preferences
      else if (student.preferences.firstPreferenceCourseBucket || student.preferences.secondPreferenceCourseBucket || student.preferences.thirdPreferenceCourseBucket) {
        if (student.preferences.firstPreferenceCourseBucket && student.preferences.firstPreferenceCourseBucket.id) {
          preferences.push({
            priority: 1,
            courseBucket: student.preferences.firstPreferenceCourseBucket,
            createdAt: student.preferences.createdAt
          });
        }
        if (student.preferences.secondPreferenceCourseBucket && student.preferences.secondPreferenceCourseBucket.id) {
          preferences.push({
            priority: 2,
            courseBucket: student.preferences.secondPreferenceCourseBucket,
            createdAt: student.preferences.createdAt
          });
        }
        if (student.preferences.thirdPreferenceCourseBucket && student.preferences.thirdPreferenceCourseBucket.id) {
          preferences.push({
            priority: 3,
            courseBucket: student.preferences.thirdPreferenceCourseBucket,
            createdAt: student.preferences.createdAt
          });
        }
      }
    }

    return preferences.sort((a, b) => a.priority - b.priority);
  };

  const preferencesArray = getPreferencesArray();

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-lg shadow-sm
          ${
            hasFilledPreferences
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {student.firstName} {student.lastName}
            </h3>
            {hasFilledPreferences && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            )}
            {!hasFilledPreferences && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span className="truncate">{student.registrationNumber}</span>
            </div>
            {hasFilledPreferences && student.preferences?.createdAt && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {dayjs(student.preferences.createdAt).fromNow(true)} ago
              </span>
            )}
            {hasFilledPreferences && (
              <span className="text-xs text-gray-500">
                {preferencesArray.length} preference{preferencesArray.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        {hasFilledPreferences && preferencesArray.length > 0 && (
          <button
            onClick={toggleExpand}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label={
              isExpanded ? "Collapse preferences" : "Expand preferences"
            }
          >
            <ChevronDown
              className={`h-5 w-5 transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Preferences Section */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {isExpanded && hasFilledPreferences && preferencesArray.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences:</h4>
            {preferencesArray.map((preference) => (
              <div
                key={preference.priority}
                className={`p-3 rounded-lg border ${getPreferenceColor(preference.priority)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    Priority {preference.priority}
                  </span>
                  <span className="text-sm font-medium truncate text-right ml-2">
                    {preference.course 
                      ? `${preference.course.name}`
                      : preference.courseBucket
                      ? preference.courseBucket.name
                      : "Not specified"
                    }
                  </span>
                </div>
                {/* Additional preference details if available */}
                {preference.course && (
                  <div className="mt-2 text-xs text-gray-600">
                    Course: {preference.course.name}
                  </div>
                )}
                {preference.courseBucket && (
                  <div className="mt-2 text-xs text-gray-600">
                    Bucket: {preference.courseBucket.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show actual preferences count */}
      {hasFilledPreferences && preferencesArray.length > 0 && !isExpanded && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 text-center">
            {preferencesArray.length} preference{preferencesArray.length !== 1 ? 's' : ''} filled - click to view details
          </p>
        </div>
      )}

      {/* No preferences message for completed but no specific preferences */}
      {hasFilledPreferences && preferencesArray.length === 0 && (
        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700 text-center">
            Preferences marked as completed but no valid preferences found in the data.
          </p>
          <p className="text-xs text-yellow-600 text-center mt-1">
            Check the data structure and allotment type.
          </p>
        </div>
      )}
    </div>
  );
}