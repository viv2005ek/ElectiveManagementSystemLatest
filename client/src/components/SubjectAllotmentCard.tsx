import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  BucketAllotment,
  StandaloneAllotment,
} from "../hooks/subjectPreferenceHooks/useSubjectAllotments.ts";

// Type guard for StandaloneAllotment
function isStandaloneAllotment(
  allotment: StandaloneAllotment | BucketAllotment,
): allotment is StandaloneAllotment {
  return (allotment as StandaloneAllotment).course !== undefined;
}

// Type guard for BucketAllotment
function isBucketAllotment(
  allotment: StandaloneAllotment | BucketAllotment,
): allotment is BucketAllotment {
  return (allotment as BucketAllotment).courseBucket !== undefined;
}

export default function SubjectAllotmentCard({
  allotment,
  index,
}: {
  allotment: StandaloneAllotment | BucketAllotment;
  index: number;
}) {
  return (
    <div
      key={index}
      className="p-2 relative ring-1 cursor-pointer ring-gray-300 rounded-md hover:shadow-md  hover:bg-gray-50 transition-all mb-2 group"
    >
      <div className="font-semibold">
        {allotment.student.firstName} {allotment.student.lastName}
        <div className="text-sm font-thin">
          {allotment.student.registrationNumber}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-xs font-semibold text-gray-700">
          Course alloted
        </div>
        <div className="text-blue-700 font-semibold text-sm">
          {isStandaloneAllotment(allotment)
            ? allotment.course.name
            : isBucketAllotment(allotment)
              ? allotment.courseBucket.name
              : "N/A"}
        </div>
      </div>
      <button className="hover:bg-gray-200 p-1 rounded-lg absolute top-2 right-2">
        <PencilIcon className="h-5 w-5 ease-in-out opacity-0 group-hover:opacity-100 transition-all" />
      </button>
      <button className="hover:bg-gray-200 p-1 rounded-lg absolute bottom-2 right-2">
        <TrashIcon className="h-5 w-5 ease-in-out opacity-0 group-hover:opacity-100 transition-all" />
      </button>
    </div>
  );
}
