import React, { useState } from "react";

// Define Types
type Preference = {
  subject: string;
  department: string;
  availableSeats: number;
};

type Student = {
  id: number;
  name: string;
  registrationNo: string;
  semester: string;
  preferences: Preference[];
  assignedTo?: string;
};

export default function Admin() {
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([
    {
      id: 1,
      name: "John Doe",
      registrationNo: "2021001",
      semester: "5th",
      preferences: [
        { subject: "AWS Basics", department: "CSE", availableSeats: 3 },
        { subject: "Machine Learning", department: "CSE", availableSeats: 2 },
        { subject: "Cloud Computing", department: "CSE", availableSeats: 4 },
        { subject: "Blockchain", department: "CSE", availableSeats: 1 },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      registrationNo: "2021002",
      semester: "4th",
      preferences: [
        { subject: "Embedded Systems", department: "ECE", availableSeats: 1 },
        {
          subject: "Control Systems",
          department: "Mechanical",
          availableSeats: 2,
        },
        { subject: "IoT", department: "ECE", availableSeats: 3 },
        { subject: "Automation", department: "Mechanical", availableSeats: 1 },
      ],
    },
  ]);

  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<"unassigned" | "assigned">(
    "unassigned",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSemester, setFilterSemester] = useState<string>("");

  const handleAssignSpecialization = (
    student: Student,
    preference: Preference,
  ) => {
    setUnassignedStudents((prev) => prev.filter((s) => s.id !== student.id));
    const updatedStudent = {
      ...student,
      preferences: student.preferences.map((pref) =>
        pref.subject === preference.subject
          ? { ...pref, availableSeats: pref.availableSeats - 1 }
          : pref,
      ),
      assignedTo: preference.subject,
    };
    setAssignedStudents((prev) => [...prev, updatedStudent]);
    setViewStudent(null);
  };

  const handleRemoveSpecialization = (student: Student) => {
    setAssignedStudents((prev) => prev.filter((s) => s.id !== student.id));
    const updatedStudent = {
      ...student,
      preferences: student.preferences.map((pref) =>
        pref.subject === student.assignedTo
          ? { ...pref, availableSeats: pref.availableSeats + 1 }
          : pref,
      ),
      assignedTo: undefined,
    };
    setUnassignedStudents((prev) => [...prev, updatedStudent]);
    setViewStudent(null);
  };

  const applyFilters = (students: Student[]) => {
    return students.filter((student) => {
      const matchesSearchQuery =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.registrationNo.includes(searchQuery);
      const matchesSemester = filterSemester
        ? student.semester === filterSemester
        : true;

      return matchesSearchQuery && matchesSemester;
    });
  };

  // Handle changing tabs
  const handleTabChange = (tab: "unassigned" | "assigned") => {
    setActiveTab(tab);
    setViewStudent(null);
  };

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Admin - Student Applications
      </h2>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or registration no."
          className="px-4 py-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by semester"
          className="px-4 py-2 border rounded-md"
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleTabChange("unassigned")}
          className={`px-4 py-2 text-white rounded-md ${
            activeTab === "unassigned" ? "bg-[#df6039]" : "bg-gray-300"
          }`}
        >
          Unassigned Students
        </button>
        <button
          onClick={() => handleTabChange("assigned")}
          className={`px-4 py-2 text-white rounded-md ${
            activeTab === "assigned" ? "bg-[#df6039]" : "bg-gray-300"
          }`}
        >
          Assigned Students
        </button>
      </div>

      {activeTab === "unassigned" ? (
        <div className="space-y-4">
          {applyFilters(unassignedStudents).map((student) => (
            <div
              key={student.id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
            >
              <div>
                <p className="text-xl font-semibold">{student.name}</p>
                <p className="text-sm text-gray-500">
                  Preferences: {student.preferences.length}
                </p>
              </div>
              <div>
                <button
                  className="bg-[#df6039] text-white rounded-md px-4 py-2"
                  onClick={() => setViewStudent(student)}
                >
                  View Preferences
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {applyFilters(assignedStudents).map((student) => (
            <div
              key={student.id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-green-100"
            >
              <div>
                <p className="text-xl font-semibold">{student.name}</p>
                <p className="text-sm text-gray-500">
                  Assigned to {student.assignedTo}
                </p>
              </div>
              <div>
                <button
                  className="bg-red-500 text-white rounded-md px-4 py-2"
                  onClick={() => handleRemoveSpecialization(student)}
                >
                  Remove Specialization
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewStudent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {viewStudent.name} Details
              </h3>
              <button
                onClick={() => setViewStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                X
              </button>
            </div>

            <p className="mb-4">
              Registration No: {viewStudent.registrationNo}
            </p>
            <p className="mb-4">Semester: {viewStudent.semester}</p>

            {activeTab === "unassigned" ? (
              <>
                <h4 className="text-lg mt-4 font-semibold">Preferences:</h4>
                <ul className="space-y-2">
                  {viewStudent.preferences.map((preference) => (
                    <li
                      key={preference.subject}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{preference.subject}</p>
                        <p className="text-sm text-gray-500">
                          {preference.department}
                        </p>
                        <p className="text-xs text-gray-400">
                          Available Seats: {preference.availableSeats}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleAssignSpecialization(viewStudent, preference)
                        }
                        className="bg-[#df6039] text-white rounded-md px-3 py-1 text-xs flex items-center"
                      >
                        Assign
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-gray-500 mt-4">
                Assigned Specialization:{" "}
                <span className="font-semibold">{viewStudent.assignedTo}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
