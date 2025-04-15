import { Student } from "../hooks/subjectPreferenceHooks/useSubjectPreferences.ts";
import { useState } from "react";
import { AllotmentType } from "../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import { ChevronDown, User, Hash, Clock, BookOpen } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface StudentPreferenceCardProps {
  student: Student;
  index: number;
  allotmentType?: AllotmentType;
}

export default function StudentPreferenceCard({
  student,
  index,
  allotmentType,
}: StudentPreferenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (student.preferences) {
      setIsExpanded(!isExpanded);
    }
  };

  const getPreferenceColor = (preferenceNumber: number) => {
    const colors = {
      1: "bg-blue-50 text-blue-700 border-blue-200",
      2: "bg-purple-50 text-purple-700 border-purple-200",
      3: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return colors[preferenceNumber as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-lg shadow-sm
          ${
            allotmentType === "Standalone"
              ? "bg-blue-100 text-blue-600"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {student.firstName} {student.lastName}
            </h3>
            {student.preferences?.createdAt && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {dayjs(student.preferences.createdAt).fromNow(true)} ago
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span className="truncate">{student.registrationNumber}</span>
            </div>
            {student.course && (
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="truncate">{student.course.name}</span>
              </div>
            )}
          </div>
        </div>
        {student.preferences && (
          <button
            onClick={toggleExpand}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label={isExpanded ? "Collapse preferences" : "Expand preferences"}
          >
            <ChevronDown
              className={`h-5 w-5 transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {isExpanded && student.preferences && (
          <div className="space-y-3">
            {allotmentType === "Standalone" ? (
              <>
                {[
                  { number: 1, course: student.preferences.firstPreferenceCourse },
                  { number: 2, course: student.preferences.secondPreferenceCourse },
                  { number: 3, course: student.preferences.thirdPreferenceCourse },
                ].map((pref) => (
                  <div
                    key={pref.number}
                    className={`p-3 rounded-lg border ${getPreferenceColor(pref.number)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Preference {pref.number}</span>
                      <span className="text-sm font-medium truncate">
                        {pref.course?.name || "Not selected"}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { number: 1, bucket: student.preferences.firstPreferenceCourseBucket },
                  { number: 2, bucket: student.preferences.secondPreferenceCourseBucket },
                  { number: 3, bucket: student.preferences.thirdPreferenceCourseBucket },
                ].map((pref) => (
                  <div
                    key={pref.number}
                    className={`p-3 rounded-lg border ${getPreferenceColor(pref.number)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Preference {pref.number}</span>
                      <span className="text-sm font-medium truncate">
                        {pref.bucket?.name || "Not selected"}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
