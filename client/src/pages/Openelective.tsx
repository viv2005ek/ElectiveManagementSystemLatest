import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout.tsx";
import ElectiveItem from "../components/ElectiveItem.tsx";


export default function OpenElective() {
    {/* route - /oe */}
    const [selectedElective, setSelectedElective] = useState<number | null>(null);

    const electives = [
        { srNo: 1, name: "Elective 1", seatsRemaining: 50 },
        { srNo: 2, name: "Elective 2", seatsRemaining: 40 },
        { srNo: 3, name: "Elective 3", seatsRemaining: 30 },
    ];

    const handleSelect = (id: number) => {
        setSelectedElective(selectedElective === id ? null : id); // Toggle selection
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-orange-100">
            <div className="py-8 px-8 bg-orange-100">
                {/* Heading */}
                <div className="flex flex-col items-center w-full p-4 ">
                    <h1 className="text-lg md:text-xl lg:text-2xl p-2 font-bold bg-orange-400 w-full rounded-md text-center mb-4">
                        SELECT AN OPEN ELECTIVE
                    </h1>
                    <div className="w-full max-w-4xl">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 bg-orange-400 p-2 rounded mb-[2px]">
                            <div className="col-span-2 font-bold text-lg md:text-xl lg:text-2xl text-center">Sr. No.</div>
                            <div className="col-span-8 font-bold text-lg md:text-xl lg:text-2xl text-center">OE Name</div>
                            <div className="col-span-2 font-bold text-lg md:text-xl lg:text-2xl text-center">Seats Left</div>
                        </div>
                        {/* Elective Items */}
                        {electives.map((elective) => (
                            <ElectiveItem
                                key={elective.srNo}
                                srNo={elective.srNo}
                                name={elective.name}
                                seatsRemaining={elective.seatsRemaining}
                                isDisabled={selectedElective !== null && selectedElective !== elective.srNo}
                                isSelected={selectedElective === elective.srNo}
                                onSelect={() => handleSelect(elective.srNo)}
                            />
                        ))}
                    </div>
                    {/* Register Button */}
                    <button
                        className={`mt-4 px-6 py-2 rounded bg-orange-500 text-white font-bold ${
                            selectedElective === null ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
                        }`}
                        disabled={selectedElective === null}
                        onClick={() => alert(`Registered for elective: ${selectedElective}`)}
                    >
                        Register
                    </button>
                </div>
            </div>
            </div>
        </MainLayout>
    );
}