import { Dispatch, SetStateAction } from "react";

export default function TextInputField({
  label,
  placeholder,
  value,
  setValue,
  disabled,
}: {
  label?: string;
  placeholder?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
      </div>
    </div>
  );
}
