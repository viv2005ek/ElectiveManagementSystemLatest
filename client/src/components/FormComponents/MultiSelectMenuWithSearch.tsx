import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Identifiable = { id: string; [key: string]: any };

interface MultiSelectMenuProps<T extends Identifiable> {
  label?: string;
  items: T[] | null;
  selected: T[];
  setSelected: Dispatch<SetStateAction<T[]>>;
  onChange?: (items: T[]) => void;
  maxSelections?: number;
  disabled?: boolean;
}

export default function MultiSelectMenuWithSearch<T extends Identifiable>({
  label,
  items,
  selected,
  setSelected,
  onChange,
  maxSelections,
  disabled,
}: MultiSelectMenuProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelected, setInternalSelected] = useState<T[]>(selected);

  useEffect(() => {
    setInternalSelected(selected);
  }, [selected]);

  const handleChange = (item: T) => {
    let newSelected;
    if (internalSelected.some((i) => i.id === item.id)) {
      newSelected = internalSelected.filter((i) => i.id !== item.id);
    } else {
      if (maxSelections && internalSelected.length >= maxSelections) return;
      newSelected = [...internalSelected, item];
    }
    setInternalSelected(newSelected);
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  const filteredItems = Array.isArray(items)
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <Listbox disabled={disabled} value={internalSelected} multiple>
      <div className={"flex flex-col items-between w-full justify-start"}>
        {label && (
          <Label className="block text-sm/6 font-medium text-gray-900">
            {label}
          </Label>
        )}
        <div className="relative mt-1.5">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span className="col-start-1 row-start-1 truncate pr-6">
              {internalSelected.length > 0
                ? internalSelected.map((item) => item.name).join(", ")
                : "Select items"}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <div className="sticky top-0 z-10 bg-white px-3 py-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
              />
            </div>
            {filteredItems.length > 0 ? (
              filteredItems
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => (
                  <ListboxOption
                    value={item}
                    key={item.id}
                    onClick={() => handleChange(item)}
                    className={`group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none ${
                      maxSelections !== undefined &&
                      internalSelected.length >= maxSelections &&
                      !internalSelected.some((i) => i.id === item.id)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                      {item.name}
                    </span>

                    {internalSelected.some((i) => i.id === item.id) && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white">
                        <CheckIcon aria-hidden="true" className="size-5" />
                      </span>
                    )}
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
