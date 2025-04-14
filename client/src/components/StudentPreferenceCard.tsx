import { Student } from "../hooks/subjectPreferenceHooks/useSubjectPreferences.ts";
import { useState } from "react";
import { AllotmentType } from "../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import { ChevronDown } from "react-feather";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function StudentPreferenceCard({
  student,
  index,
  allotmentType,
}: {
  student: Student;
  index: number;
  allotmentType?: AllotmentType;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (student.preferences) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border-2 shadow-sm border-gray-200">
      <div className="flex items-center space-x-4">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center font-medium shadow-sm
          ${
            allotmentType === "Standalone"
              ? "bg-blue-100 text-blue-600"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800">
            {student.firstName} {student.lastName}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Registration no.</span>
            <span>{student.registrationNumber}</span>
          </div>
        </div>
        {student.preferences?.createdAt && (
          <div className={"text-xs font-semibold text-gray-400"}>
            created {dayjs(student.preferences?.createdAt).fromNow(true)} ago
          </div>
        )}
        {student.preferences && (
          <button
            onClick={toggleExpand}
            className="text-blue-600 hover:underline text-sm flex items-center"
          >
            <ChevronDown
              className={`ml-2 h-6 w-6 transform transition-transform duration-500 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {isExpanded && student.preferences && (
          <div className="mt-4 space-y-2">
            {allotmentType === "Standalone" ? (
              <>
                <p className={"bg-gray-100 p-2 rounded-lg"}>
                  <div className={"text-xs font-semibold"}>
                    First Preference
                  </div>{" "}
                  <div className={"text-sm"}>
                    {student.preferences.firstPreferenceCourse?.name || "N/A"}
                  </div>
                </p>
                <p className={"bg-gray-100 p-2 rounded-lg"}>
                  <div className={"text-xs font-semibold"}>
                    Second Preference
                  </div>{" "}
                  <div className={"text-sm"}>
                    {student.preferences.secondPreferenceCourse?.name || "N/A"}
                  </div>
                </p>
                <p className={"bg-gray-100 p-2 rounded-lg"}>
                  <div className={"text-xs font-semibold"}>
                    Third Preference
                  </div>{" "}
                  <div className={"text-sm"}>
                    {student.preferences.thirdPreferenceCourse?.name || "N/A"}
                  </div>
                </p>
              </>
            ) : (
              <>
                <p className={"bg-gray-100 p-2 rounded-lg"}>
                  <div className={"text-xs font-semibold"}>
                    First Preference Bucket
                  </div>{" "}
                  <div className={"text-sm"}>
                    {student.preferences.firstPreferenceCourseBucket?.name ||
                      "N/A"}
                  </div>
                </p>
                <p className={"bg-gray-100 p-2 rounded-lg"}>
                  <div className={"text-xs font-semibold"}>
                    Second Preference Bucket
                  </div>{" "}
                  <div className={"text-sm"}>
                    {student.preferences.secondPreferenceCourseBucket?.name ||
                      "N/A"}
                  </div>
                </p>
                <p className={"bg-gray-100 p-2 rounded-lg"}>
                  <div className={"text-xs font-semibold"}>
                    Third Preference Bucket
                  </div>{" "}
                  <div className={"text-sm"}>
                    {student.preferences.thirdPreferenceCourseBucket?.name ||
                      "N/A"}
                  </div>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
