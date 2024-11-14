enum Status {
  Complete = "Complete",
  "In Progress" = "In Progress",
  Archived = "Archived",
  Pending = "Pending",
}

const statuses = {
  [Status.Complete]: "text-green-700 bg-green-50 ring-green-600/20",
  [Status["In Progress"]]: "text-gray-600 bg-gray-50 ring-gray-500/10",
  [Status.Archived]: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  [Status.Pending]: "text-red-700 bg-red-50 ring-red-600/20", // Added Pending status
};


const projects = [
  {
    id: 1,
    name: "Semester 1",
    href: "#",
    status: Status.Complete, // Use Status enum
    type: "Programme Elective",
    dueDate: "March 17, 2023",
    dueDateTime: "2023-03-17T00:00Z",
  },
  {
    id: 2,
    name: "Semester 3",
    href: "#",
    status: Status.Complete,
    type: "Open Elective",
    dueDate: "May 5, 2023",
    dueDateTime: "2023-05-05T00:00Z",
  },
  {
    id: 3,
    name: "Semester 2",
    href: "#",
    status: Status.Complete,
    type: "Open Elective",
    dueDate: "May 25, 2023",
    dueDateTime: "2023-05-25T00:00Z",
  },
  {
    id: 4,
    name: "Semester 1",
    href: "#",
    status: Status.Pending,
    type: "Open Elective",
    dueDate: "June 7, 2023",
    dueDateTime: "2023-06-07T00:00Z",
  },
  {
    id: 5,
    name: "Semester 5",
    href: "#",
    status: Status.Pending,
    type: "Programme Elective",
    dueDate: "June 10, 2023",
    dueDateTime: "2023-06-10T00:00Z",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function UpcomingDeadlinesList() {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {projects.map((project) => (
        <li
          key={project.id}
          className="flex items-center justify-between gap-x-6 py-5 hover:bg-gray-100 px-4 rounded-lg"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm/6 font-semibold text-gray-900">
                {project.name}
              </p>
              <p
                className={classNames(
                  statuses[project.status as Status], // Cast to Status enum
                  "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                )}
              >
                {project.status}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
              <p className="whitespace-nowrap">
                Due on{" "}
                <time dateTime={project.dueDateTime}>{project.dueDate}</time>
              </p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p className="truncate">{project.type}</p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            {project.status === Status.Pending && (
              <a
                href={project.href}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                Choose elective<span className="sr-only">, {project.name}</span>
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
