import React from "react";

interface ElectiveItemProps {
  srNo: number;
  name: string;
  courseCode: string;
  seatsRemaining: number;
  isDisabled: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const ElectiveItem: React.FC<ElectiveItemProps> = ({
  srNo,
  name,
  courseCode,
  seatsRemaining,
  isDisabled,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`grid grid-cols-12 items-center p-4 m-2 border rounded-lg transition-all duration-300 ease-in-out shadow-md ${
        isSelected
          ? "bg-[#df6939] text-white"
          : "bg-[#fdf0e1] text-[#df6939] z-0"
      } ${isDisabled && !isSelected ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="font-semibold col-span-2 text-center text-lg">{srNo}</div>
      <div className="font-semibold col-span-5 text-center text-lg">{name}</div>
      <div className="font-semibold col-span-3 text-center text-lg">
        {courseCode}
      </div>
      <div className="font-semibold col-span-2 flex justify-center items-center">
        <div className="flex justify-between w-full">
          <span
            className={`text-md ${
              isSelected ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {seatsRemaining} Seats Left
          </span>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="cursor-pointer w-5 h-5 accent-[#df6939] rounded-sm border-[#df6939] transition-colors duration-300 ease-in-out hover:bg-[#fbd6c4]"
              aria-label={`Select ${name}`}
              disabled={isDisabled && !isSelected}
              checked={isSelected}
              onChange={onSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectiveItem;
