import { Dispatch, SetStateAction, useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

type Identifiable = { id: string; name: string; [key: string]: any };

interface SingleSelectMenuWithSearchProps<T extends Identifiable> {
  label?: string;
  items: T[] | null;
  selected: T | null;
  setSelected: Dispatch<SetStateAction<T | null>>;
  onChange?: (item: T) => void;
}

export default function SingleSelectMenuWithSearch<T extends Identifiable>({
  label,
  items,
  selected,
  setSelected,
  onChange,
}: SingleSelectMenuWithSearchProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (item: T) => {
    setSelected(item);
    if (onChange) {
      onChange(item);
    }
  };

  // Filter items based on search query
  const filteredItems = items
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="flex flex-col items-between w-full justify-start">
        {label && (
          <Label className="block text-sm font-medium text-gray-900">
            {label}
          </Label>
        )}
        <div className="relative mt-2.5">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span className="col-start-1 row-start-1 truncate pr-6">
              {selected ? selected.name : `Select a ${label}`}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {/* Search Input Field */}
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              />
            </div>

            {/* Render filtered items */}
            {filteredItems.length > 0 ? (
              filteredItems
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => (
                  <ListboxOption
                    key={item.id}
                    value={item}
                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                  >
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                      {item.name}
                    </span>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                      <CheckIcon aria-hidden="true" className="size-5" />
                    </span>
                  </ListboxOption>
                ))
            ) : (
              <div className="py-2 px-3 text-gray-500">No items found</div>
            )}
          </ListboxOptions>
        </div>
      </div>
    </Listbox>
  );
}
