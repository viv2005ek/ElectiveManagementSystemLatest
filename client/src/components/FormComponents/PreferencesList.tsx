import { getOrdinalSuffix } from "../../utils/StringUtils.ts";
import { T } from "../../pages/SubjectPages/SubjectPreferencesFillingPage.tsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function PreferencesList({
  queue,
  size,
  handleRemove,
}: {
  queue: T[];
  size: number;
  handleRemove: (id: string) => void;
}) {
  return (
    <div className={"mt-12 mb-12"}>
      <div className={"font-semibold mb-2"}>Your Preferences</div>
      <div className="flex flex-row justify-between  space-x-4 bg-gray-100 rounded-lg p-2">
        {Array.from({ length: size }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 relative border rounded-lg hover:bg-gray-50 transition-all w-full bg-white"
          >
            {queue[index]?.name && (
              <button
                className={
                  "p-1 hover:bg-gray-100 rounded-lg absolute top-2 right-2 transition-all"
                }
                onClick={() => handleRemove(queue[index].id ?? "")}
              >
                <XMarkIcon
                  className={
                    "h-5 w-5 stroke-2 stroke-red-600  hover:scale-110 transition-all"
                  }
                />
              </button>
            )}

            <div className="font-semibold text-sm text-gray-700">
              {index + 1}
              {getOrdinalSuffix(index + 1)} Preference
            </div>
            {queue[index]?.name ? (
              <div className="font-thin text-gray-900 mt-2">
                {queue[index].name}
              </div>
            ) : (
              <div className="font-semibold text-gray-500 text-xs mt-2">
                No preference added yet
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
