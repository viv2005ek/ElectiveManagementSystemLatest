import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { flip, offset, shift, useFloating } from "@floating-ui/react";

interface SingleSelectEnumSelectorProps<T> {
  label?: string;
  items: T[];
  selected: T | null;
  setSelected: Dispatch<SetStateAction<T | null>>;
  onChange?: (item: T) => void;
  info?: string;
  disabled?: boolean;
}

export default function SingleSelectEnumSelector<T>({
  label,
  items,
  selected,
  setSelected,
  onChange,
  info,
  disabled,
}: SingleSelectEnumSelectorProps<T>) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift()],
  });

  const handleChange = (item: T) => {
    setSelected(item);
    setOpen(false);
    if (onChange) {
      onChange(item);
    }
  };

  return (
    <Listbox value={selected} onChange={handleChange} disabled={disabled}>
      <div className="flex flex-col w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <ListboxButton
            ref={refs.setReference}
            onClick={() => setOpen(!open)}
            className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
          >
            <span className="col-start-1 row-start-1 truncate pr-6">
              {selected ? String(selected) : "Select an item"}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          {open && (
            <ListboxOptions
              ref={refs.setFloating}
              style={floatingStyles}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            >
              {items.length > 0 ? (
                items.map((item, index) => (
                  <ListboxOption
                    key={index}
                    value={item}
                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {String(item)}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                            <CheckIcon className="size-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))
              ) : (
                <div className="py-2 px-3 text-gray-500">
                  No items available
                </div>
              )}
            </ListboxOptions>
          )}
        </div>
        {info && <p className="mt-2 text-sm text-gray-500">{info}</p>}
      </div>
    </Listbox>
  );
}
