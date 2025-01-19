import React from 'react';

interface ElectiveItemProps {
    srNo: number;
    name: string;
    seatsRemaining: number;
    isDisabled: boolean;
    isSelected: boolean;
    onSelect: () => void;
}

const ElectiveItem: React.FC<ElectiveItemProps> = ({ srNo, name, seatsRemaining, isDisabled, isSelected, onSelect }) => {
    return (
        <div
            className={`grid grid-cols-12 items-center p-2 m-[2px] border border-black rounded ${
                isSelected ? 'bg-orange-400' : 'bg-orange-200'
            } ${isDisabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className="font-mono col-span-2 text-center">{srNo}</div>
            <div className="font-mono col-span-8 text-center">{name}</div>
            <div className="font-mono col-span-2 flex justify-center items-center">
                <div className="flex justify-between w-full">
                    <span>{seatsRemaining}</span>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="cursor-pointer w-3 h-3 accent-orange-500 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 hover:border-blue-300 hover:bg-blue-50"
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
