import { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL = "https://apiems.shreshth.tech/course-buckets";

interface Department {
  id: string;
  name: string;
}

interface ProgrammeElective {
  id: string;
  name: string;
  code: string;
  credits: number;
  departmentId: string;
}

interface CourseBucket {
  id: string;
  name: string;
  departmentId: string;
  department: Department; // Ensure department is typed correctly
  courses: ProgrammeElective[];
}

const updateCourseBuckets = (prev: CourseBucket[]) => {
  return [
    ...prev,
    {
      id: "someId",
      name: "someName",
      departmentId: "someDeptId",
      department: { id: "someDeptId", name: "someDepartment" }, // Ensure department property is included
      courses: [],
    },
  ];
};

function Notification({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-x-2 rounded-lg bg-[#df6039] px-4 py-2 text-white shadow-lg transition-all duration-300 ease-in-out">
      <p>{message}</p>
      <XCircleIcon
        className="h-5 w-5 cursor-pointer hover:text-gray-200"
        onClick={onClose}
      />
    </div>
  );
}

export default function MinorSpecializationsList() {
  const [courseBuckets, setCourseBuckets] = useState<CourseBucket[]>([]);
  const [preferences, setPreferences] = useState<CourseBucket[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        setCourseBuckets(data);
      })
      .catch((err) => console.error("Error fetching course buckets:", err));
  }, []);

  const handleSelectSpecialization = (
    id: string,
    name: string,
    departmentId: string,
    department: Department, // Ensure department is of type `Department` object
    courses: ProgrammeElective[], // Also ensure courses is typed as an array of ProgrammeElective
  ) => {
    if (preferences.some((pref) => pref.id === id)) {
      setPreferences((prev) => prev.filter((pref) => pref.id !== id));
    } else {
      if (preferences.length >= 4) {
        setNotification("You can select a maximum of 4 preferences.");
        return;
      }
      setPreferences((prev) => [
        ...prev,
        { id, name, departmentId, department, courses }, // Properly pass the department and courses
      ]);
    }
  };

  const handleRemovePreference = (index: number) => {
    setPreferences((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 bg-gray-50">
      <ul className="divide-y divide-gray-200 overflow-hidden bg-white shadow-md rounded-lg ring-1 ring-gray-900/5">
        {courseBuckets.map((bucket) => (
          <li key={bucket.id} className="relative">
            <div
              className="flex items-center justify-between px-4 py-3 sm:px-6 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-100 rounded-lg"
              onClick={() => {
                setOpenDropdown(openDropdown === bucket.id ? null : bucket.id);
              }}
            >
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-800">
                  {bucket.name}
                </p>
                <span className="text-xs text-gray-500">
                  {bucket.department?.name}
                </span>{" "}
                {/* Safely access department.name */}
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSpecialization(
                      bucket.id,
                      bucket.name,
                      bucket.departmentId,
                      bucket.department, // Pass the entire department object
                      bucket.courses, // Pass the courses array
                    );
                  }}
                  className={`ml-4 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    preferences.some((pref) => pref.id === bucket.id)
                      ? "bg-[#df6039] text-white hover:bg-[#c8502f]"
                      : "bg-[#df6039] text-white hover:bg-[#c8502f]"
                  }`}
                >
                  {preferences.some((pref) => pref.id === bucket.id)
                    ? `Preference ${preferences.findIndex((pref) => pref.id === bucket.id) + 1}`
                    : "Select"}
                </button>
                <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-600" />
              </div>
            </div>
            {openDropdown === bucket.id && (
              <ul className="bg-gray-50 px-4 py-2 sm:px-6 rounded-lg shadow-sm transition-all duration-200">
                {bucket.courses.map((course) => (
                  <li
                    key={course.id}
                    className="py-1 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-all duration-200"
                  >
                    - {course.name} ({course.code}) - {course.credits} Credits
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="overflow-hidden bg-white shadow-md ring-1 ring-gray-900/5 rounded-lg">
        <div className="px-4 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Preference Table
          </h2>
        </div>
        <div className="px-4 py-3 sm:px-6">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200 bg-white">
              {preferences.map((preference, index) => (
                <tr key={index}>
                  <td className="px-2 py-4 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-500">
                    {preference.name}
                  </td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() => handleRemovePreference(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-[#df6039] px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-[#c8502f] transition-all duration-200"
              onClick={() => {
                if (preferences.length < 4) {
                  setNotification(
                    "Please select 4 preferences before submitting.",
                  );
                  return;
                }
                setNotification("Preferences submitted successfully!");
              }}
            >
              Submit Preferences
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
