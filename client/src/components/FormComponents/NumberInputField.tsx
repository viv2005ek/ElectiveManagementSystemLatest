import { Dispatch, SetStateAction } from "react";

export default function NumberInputField({
  label,
  placeholder,
  value,
  setValue,
  minValue,
  maxValue,
}: {
  label?: string;
  placeholder?: string;
  value: number | undefined;
  setValue: Dispatch<SetStateAction<number | undefined>>;
  minValue?: number;
  maxValue?: number;
}) {
  return (
    <div>
      <label className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const inputValue = Number(e.target.value);
            if (!isNaN(inputValue)) {
              let newValue = inputValue;
              if (maxValue !== undefined)
                newValue = Math.min(newValue, maxValue);
              if (minValue !== undefined)
                newValue = Math.max(newValue, minValue);
              setValue(newValue);
            }
          }}
          placeholder={placeholder}
          min={minValue}
          max={maxValue}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
      </div>
    </div>
  );
}
