import {Listbox, ListboxButton, ListboxOption, ListboxOptions,} from "@headlessui/react";
import {ChevronUpDownIcon} from "@heroicons/react/16/solid";
import {CheckIcon} from "@heroicons/react/20/solid";
import {useEffect, useRef, useState} from "react";

interface GenericItem {
  number: number;
  name: string;
  id: string;
}

interface SingleSelectFilterProps<T extends GenericItem> {
  name: string;
  items: T[] | null;
  selected: number | null;
  setSelected: (number: number) => void;
}

export default function SingleSelectFilter<T extends GenericItem>({
  name,
  items,
  selected,
  setSelected,
}: SingleSelectFilterProps<T>) {
  const [maxWidth, setMaxWidth] = useState("auto");
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedItem = items?.find((item) => item.number === selected) || null;

  useEffect(() => {
    if (items && items.length > 0) {
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.visibility = "hidden";
      tempContainer.style.whiteSpace = "nowrap";
      document.body.appendChild(tempContainer);

      let maxItemWidth = 0;
      tempContainer.innerText = `Select ${name}`;
      maxItemWidth = Math.max(maxItemWidth, tempContainer.offsetWidth);

      items.forEach((item) => {
        tempContainer.innerText = item.name;
        maxItemWidth = Math.max(maxItemWidth, tempContainer.offsetWidth);
      });

      document.body.removeChild(tempContainer);
      setMaxWidth(`${maxItemWidth + 40}px`); // Add padding
    }
  }, [items, name]);

  return (
    <Listbox
      value={selectedItem}
      onChange={(item) => item && setSelected(item.number)}
    >
      <div
        className="relative mt-2"
        ref={listboxRef}
        style={{ width: maxWidth }}
      >
        <ListboxButton
          className={`${selectedItem ? "bg-orange-300" : ""} w-full cursor-default grid-cols-1 rounded-md flex p-2 gap-2 bg-white items-center justify-center pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
        >
          <span>{selectedItem ? selectedItem.name : `Select ${name}`}</span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          {items?.map((item) => (
            <ListboxOption
              key={item.id}
              value={item}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
            >
              <span className="block truncate font-normal group-data-[selected]:font-semibold">
                {item.name}
              </span>
              {selected === item.number && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
