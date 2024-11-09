import { HomeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, count: "5", current: true },
  {
    name: "Programme electives",
    href: "/open-electives",
    icon: HomeIcon,
    count: "5",
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  return (
    <div className="flex grow flex-col  gap-y-5 min-h-screen h-full overflow-y-auto bg-muj-orange  text-white px-6">
      <div className="flex h-16 mt-4 shrink-0 items-center">
        <img alt="Your Company" src="/MUJ_logo.png" className="h-48 w-auto" />
      </div>
      <nav className="flex mt-8 flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-muj-orange bg-opacity-70  "
                        : " hover:bg-muj-orange hover:bg-opacity-30",
                      "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        item.current
                          ? ""
                          : "text-indigo-200 stroke-white font-semibold ",
                        "h-6 w-6 shrink-0",
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
