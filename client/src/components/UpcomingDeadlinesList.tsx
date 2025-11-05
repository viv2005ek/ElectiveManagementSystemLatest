import { ActiveSubject } from "../hooks/subjectHooks/useFetchActiveSubjects.ts";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";

export enum PreferenceFillingStatus {
  Completed = "Completed",
  Pending = "Pending",
}

const statuses = {
  [PreferenceFillingStatus.Completed]:
    "text-green-700 bg-green-50 ring-green-600/20",
  [PreferenceFillingStatus.Pending]: "text-red-700 bg-red-50 ring-red-600/20",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function UpcomingDeadlinesList({
  subjects,
  loading,
}: {
  subjects: ActiveSubject[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <ul role="list" className="divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-x-6 py-5 border px-4 rounded-lg"
          >
            <div className="min-w-0">
              <Skeleton width={200} height={20} />
              <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                <Skeleton width={100} height={15} />
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <Skeleton width={100} height={15} />
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <Skeleton width={100} height={30} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <CheckBadgeIcon className="h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-semibold text-gray-600">
          No active allotments
        </p>
        <p className="mt-2 text-sm text-gray-500">
          There are currently no active subject allotments available.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {subjects.map((subject) => (
        <li
          key={subject.id}
          className="flex items-center justify-between gap-x-6 py-5 border-2 px-4 rounded-lg mt-2"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm/6 font-semibold text-gray-900">
                {subject.name}
              </p>
              <p
                className={classNames(
                  statuses[subject.status],
                  "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                )}
              >
                {subject.status}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
              <p className="whitespace-nowrap">
                Due on{" "}
                <time dateTime={subject.dueDate}>
                  {dayjs(subject.dueDate).format("D MMMM YYYY")}
                </time>
              </p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p className="truncate">{subject.subjectType.name}</p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            {/* {subject.isPreferenceWindowOpen && (
              <Link
                to={`/subjects/${subject.id}/preferences-${subject.status === "Completed" ? "update" : "fill"}`}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                {subject.status === PreferenceFillingStatus.Completed &&
                  "Update Preferences"}
                {subject.status === PreferenceFillingStatus.Pending &&
                  "Fill Preferences"}
                <span className="sr-only">, {subject.name}</span>
              </Link>
            )} */}
            {subject.isPreferenceWindowOpen && subject.status === "Pending" && (
  <Link
    to={`/subjects/${subject.id}/preferences-fill`}
    className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
  >
    Fill Preferences
    <span className="sr-only">, {subject.name}</span>
  </Link>
)}
          </div>
        </li>
      ))}
    </ul>
  );
}
