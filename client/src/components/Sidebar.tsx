import { HomeIcon } from "@heroicons/react/24/outline";
import { FaWpforms } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";

import { Link } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, count: "5", current: true },
  {
    name: "Programme electives",
    href: "/open-electives",
    icon: FaWpforms,
    count: "5",
    current: false,
  },
  {
    name: "Student List",
    href: "/student-list",
    icon: PiStudentBold,
    count: "5",
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
function handleClick(currentItem:{current: boolean}) {
  navigation.map((item) => (item.current=false));
  currentItem.current = true;
}

export default function Sidebar() {
  return (
    <div className="flex flex-col min-h-screen h-full overflow-y-auto bg-muj-orange text-white px-6 fixed z-10">
      <div className="flex h-24 mt-4 shrink-0 items-center justify-center bg-white rounded-lg shadow-md">
        <img alt="Your Company" src="/MUJ_logo.png" className="h-16 w-auto" style={{scale:"3"}}/>
      </div>

      <nav className="flex mt-8 flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-6">
          {navigation.map((item) => (
            <li key={item.name} onClick={()=>handleClick(item)}>
              <Link
                to={item.href}
                className={classNames(
                  item.current
                    ? "bg-white text-muj-orange shadow-lg"
                    : "text-white hover:bg-opacity-20 hover:bg-white",
                  "group flex items-center gap-x-4 rounded-lg p-3 font-semibold text-md transition-all duration-300 ease-in-out"
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={classNames(
                    item.current
                      ? "text-muj-orange"
                      : "text-white",
                    "h-6 w-6 transition-colors duration-300 ease-in-out"
                  )}
                />
                <span className="flex-1">{item.name}</span>

              
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
