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
      <ul role="list" className="space-y-3 sm:space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <li
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-x-6 p-4 sm:py-5 border rounded-lg bg-white"
          >
            <div className="min-w-0 flex-1">
              <Skeleton width={200} height={20} className="mb-2" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-x-2 text-xs text-gray-500">
                <Skeleton width={120} height={15} />
                <div className="hidden sm:block">
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                </div>
                <Skeleton width={100} height={15} />
              </div>
            </div>
            <div className="flex justify-end sm:flex-none sm:items-center gap-x-4">
              <Skeleton width={100} height={32} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
        <CheckBadgeIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
        <p className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-600">
          No active allotments
        </p>
        <p className="mt-1 sm:mt-2 text-sm text-gray-500 max-w-sm">
          There are currently no active subject allotments available.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className="space-y-3 sm:space-y-4">
      {subjects.map((subject) => (
        <li
          key={subject.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-x-6 p-4 border-2 rounded-lg bg-white hover:shadow-sm transition-shadow duration-200"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-col xs:flex-row xs:items-start gap-2 xs:gap-x-3">
              <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                {subject.name}
              </p>
              <p
                className={classNames(
                  statuses[subject.status],
                  "whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset w-fit",
                )}
              >
                {subject.status}
              </p>
            </div>
            <div className="mt-2 flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-x-2 text-xs text-gray-500">
              <p className="whitespace-nowrap">
                Due on{" "}
                <time dateTime={subject.dueDate}>
                  {dayjs(subject.dueDate).format("D MMMM YYYY")}
                </time>
              </p>
              <div className="hidden xs:block">
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
              </div>
              <p className="truncate">{subject.subjectType.name}</p>
            </div>
          </div>
          <div className="flex justify-end sm:flex-none sm:items-center gap-x-4">
            {subject.isPreferenceWindowOpen && (
              <Link
                to={`/subjects/${subject.id}/preferences-${subject.status === "Completed" ? "update" : "fill"}`}
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors duration-200 w-full sm:w-auto text-center"
              >
                {subject.status === PreferenceFillingStatus.Completed &&
                  "Update Preferences"}
                {subject.status === PreferenceFillingStatus.Pending &&
                  "Fill Preferences"}
                <span className="sr-only">, {subject.name}</span>
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}