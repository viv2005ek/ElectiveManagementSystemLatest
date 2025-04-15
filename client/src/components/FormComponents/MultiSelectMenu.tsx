import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction, useState } from "react";
import { flip, offset, shift, useFloating } from "@floating-ui/react";

type Identifiable = {
  id: string;
  name?: string;
  number?: number;
  [key: string]: any;
};

interface MultiSelectMenuProps<T extends Identifiable> {
  label?: string;
  items: T[] | null;
  selected: T[];
  setSelected: Dispatch<SetStateAction<T[]>>;
  onChange?: (items: T[]) => void;
  prefix?: string;
  disabled?: boolean;
}

export default function MultiSelectMenu<T extends Identifiable>({
  label,
  items,
  selected,
  setSelected,
  onChange,
  prefix,
  disabled,
}: MultiSelectMenuProps<T>) {
  const [open, setOpen] = useState(false);
  
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift()],
  });

  const handleChange = (newSelected: T[]) => {
    setSelected(newSelected);
    setOpen(false);
    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <Listbox
      value={selected}
      disabled={disabled}
      onChange={handleChange}
      multiple
    >
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
              disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "hover:border-gray-400"
            }`}
          >
            <span className="block truncate">
              {selected.length > 0
                ? selected
                    .map(
                      (item) => `${prefix ?? ""} ` + (item.number ?? item.name),
                    )
                    .join(", ")
                : `Select ${label}`}
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
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item) => (
                  <ListboxOption
                    key={item.id}
                    value={item}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-3 pr-9 ${
                        active ? "bg-blue-50 text-blue-900" : "text-gray-900"
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
                          {`${prefix ?? ""} ` + (item.number ?? item.name)}
                        </span>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                              active ? "text-blue-600" : "text-blue-500"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))
              ) : (
                <div className="py-2 px-3 text-gray-500">No items available</div>
              )}
            </ListboxOptions>
          )}
        </div>
      </div>
    </Listbox>
  );
}
