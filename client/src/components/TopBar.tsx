import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function TopBar() {
  return (
    <div className="shadow-md h-16 flex items-center justify-end px-4 ">
      <div className={"flex flex-grow"}>
        <div className={"ml-4"}>
          <div className={"text-xl"}>
            <span className={"font-thin"}>Welcome back, </span>
            <span className={"font-semibold"}>Shreshth</span>
          </div>
          <div className={"text-xl"}>
            <span className={"font-semibold"}>B.Tech </span>
            <span>in </span>
            <span className={"font-semibold"}>CSE </span>
          </div>
        </div>
      </div>
      <div className={"flex flex-row items-center gap-4"}>
        <UserCircleIcon className="h-12 w-auto text-gray-600 stroke-1" />
      </div>
    </div>
  );
}
