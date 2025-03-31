import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction, useState } from "react";
import { pascalToNormal } from "../../utils/StringUtils.ts";

interface SingleSelectMenuProps {
  label?: string;
  items: string[];
  selected: string | null;
  setSelected: Dispatch<SetStateAction<string | null>>;
  onChange?: (item: string) => void;
  info?: string;
}

export default function SingleSelectEnumSelector({
  label,
  items,
  selected,
  setSelected,
  info,
  onChange,
}: SingleSelectMenuProps) {
  const [hover, setHover] = useState(false);

  const handleChange = (item: string) => {
    setSelected(item);
    if (onChange) {
      onChange(item);
    }
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="flex flex-col items-between w-full justify-start">
        <div className={"flex flex-row items-end gap-2"}>
          {label && (
            <Label className="block text-sm font-medium text-gray-900">
              {label}
            </Label>
          )}
          {info && (
            <div
              className="relative flex items-center"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <InformationCircleIcon className="h-5 w-5 text-gray-700 cursor-pointer" />

              {hover && info && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-600 bg-opacity-80 px-2 py-1 text-xs text-white shadow-md">
                  {info}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative mt-1.5">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm">
            <span className="col-start-1 row-start-1 truncate pr-6">
              {selected ? selected : "Select an item"}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            {items.length > 0 ? (
              items
                .sort((a, b) => a.localeCompare(b))
                .map((item) => (
                  <ListboxOption
                    key={item}
                    value={item}
                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                  >
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                      {item}
                    </span>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                      <CheckIcon aria-hidden="true" className="size-5" />
                    </span>
                  </ListboxOption>
                ))
            ) : (
              <div className="py-2 px-3 text-gray-500">No items available</div>
            )}
          </ListboxOptions>
        </div>
      </div>
    </Listbox>
  );
}
