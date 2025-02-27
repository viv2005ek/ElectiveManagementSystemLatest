import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import useDebounce from "../hooks/useDebounce.ts";

export default function SearchBarWithDebounce({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 1000); // Debounce delay of 300ms

  useEffect(() => {
    setValue(debouncedValue);
  }, [debouncedValue, setValue]);

  return (
    <div
      className={
        "ring-gray-200 ring-1 rounded-lg h-10 flex flex-row items-center px-2"
      }
    >
      <input
        placeholder={"Search"}
        className={
          "border-none text-sm outline-none h-10 ring-none rounded-lg focus:ring-0 focus:outline-0 focus:border-0"
        }
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <MagnifyingGlassIcon className={"h-6 w-6 stroke-gray-400"} />
    </div>
  );
}
