// OpenElective.tsx
import React, { useState } from 'react';
import ElectiveItem from './ElectiveItem.tsx';

type Elective = {
  name: string;
  courseCode: string;
  seatsRemaining: number;
};

interface OpenElectiveProps {
  electives: Elective[];
  onRegister: (elective: Elective) => void;
}

const OpenElective: React.FC<OpenElectiveProps> = ({
  electives,
  onRegister,
}) => {
  const [selectedElective, setSelectedElective] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedElective(selectedElective === id ? null : id);
  };

  const handleRegister = () => {
    if (selectedElective !== null) {
      const elective = electives[selectedElective - 1];
      onRegister(elective);
      setSelectedElective(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h1 className="text-lg md:text-xl lg:text-2xl p-3 font-bold bg-[#df6939] text-white w-full rounded-md text-center shadow-md mb-6">
        SELECT AN OPEN ELECTIVE
      </h1>
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-12 bg-[#df6939] text-white p-3 rounded-t-lg shadow-sm">
          <div className="col-span-2 font-semibold text-center">Sr. No.</div>
          <div className="col-span-5 font-semibold text-center">OE Name</div>
          <div className="col-span-3 font-semibold text-center">
            Course Code
          </div>
          <div className="col-span-2 font-semibold text-center">Seats Left</div>
        </div>
        {electives.map((elective, index) =>
          elective.seatsRemaining > 0 ? (
            <ElectiveItem
              key={index}
              srNo={index + 1}
              name={elective.name}
              courseCode={elective.courseCode}
              seatsRemaining={elective.seatsRemaining}
              isDisabled={
                selectedElective !== null && selectedElective !== index + 1
              }
              isSelected={selectedElective === index + 1}
              onSelect={() => handleSelect(index + 1)}
            />
          ) : null,
        )}
      </div>
      <button
        className={`mt-6 px-8 py-3 rounded-full bg-[#df6939] text-white font-bold shadow-lg transform transition-all duration-200 ${
          selectedElective === null
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#c95e31]"
        }`}
        disabled={selectedElective === null}
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
};

export default OpenElective;
