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
import { flip, offset, shift, useFloating } from "@floating-ui/react";

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
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift()],
  });

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
      <div className="flex flex-col items-between w-full justify-start">
        {label && (
          <Label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </Label>
        )}
        <div className="relative mt-1">
          <ListboxButton
            ref={refs.setReference}
            onClick={() => setOpen(!open)}
            className={`w-full cursor-default rounded-md bg-white py-2.5 px-3.5 text-left text-gray-900 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-150 ${
              disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "hover:border-gray-400"
            }`}
          >
            <span className="block truncate">
              {internalSelected.length > 0
                ? internalSelected.map((item) => item.name).join(", ")
                : "Select items"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronUpDownIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </span>
          </ListboxButton>

          {open && (
            <ListboxOptions
              ref={refs.setFloating}
              style={floatingStyles}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            >
              <div className="sticky top-0 z-10 bg-white px-3 py-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                          active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                        } ${
                          maxSelections !== undefined &&
                          internalSelected.length >= maxSelections &&
                          !internalSelected.some((i) => i.id === item.id)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {item.name}
                          </span>
                          {selected && (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                active ? "text-blue-600" : "text-blue-500"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))
              ) : (
                <div className="py-2 px-3 text-gray-500">No items found</div>
              )}
            </ListboxOptions>
          )}
        </div>
      </div>
    </Listbox>
  );
}
