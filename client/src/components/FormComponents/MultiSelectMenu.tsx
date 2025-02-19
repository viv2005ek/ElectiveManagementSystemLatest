import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";

type Identifiable = { id: string; [key: string]: any };

interface MultiSelectMenuProps<T extends Identifiable> {
  label?: string;
  items: T[] | null;
  selected: T[];
  setSelected: Dispatch<SetStateAction<T[]>>;
  onChange?: (items: T[]) => void;
}

export default function MultiSelectMenu<T extends Identifiable>({
  label,
  items,
  selected,
  setSelected,
  onChange,
}: MultiSelectMenuProps<T>) {
  const handleChange = (newSelected: T[]) => {
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <Listbox value={selected} onChange={handleChange} multiple>
      <div className={"flex flex-col items-between w-full justify-start"}>
        {label && (
          <Label className="block text-sm/6 font-medium text-gray-900">
            {label}
          </Label>
        )}
        <div className="relative mt-1.5">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <span className="col-start-1 row-start-1 truncate pr-6">
              {selected.length > 0
                ? selected.map((item) => item.name).join(", ")
                : "Select items"}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
          >
            {Array.isArray(items) && items.length > 0 ? (
              items
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

                    {selected.some((i) => i.id === item.id) && (
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
