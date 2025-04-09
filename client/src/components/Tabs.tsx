import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Dispatch, SetStateAction } from "react";

export interface Tab {
  name: string;
  href?: string;
  current: boolean;
  value?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({
  tabs,
  className = "",
  activeTab,
  setActiveTab,
}: {
  tabs: Tab[];
  className?: string;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}) {
  const handleTabChange = (selectedTabName: string) => {
    setActiveTab(selectedTabName);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={activeTab}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          onChange={(e) => handleTabChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabChange(tab.name)}
                aria-current={activeTab === tab.name ? "page" : undefined}
                className={classNames(
                  activeTab === tab.name
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap",
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
