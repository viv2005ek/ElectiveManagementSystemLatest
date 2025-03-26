/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";

type Student = {
  id: number;
  name: string;
  preference1: string;
  preference2: string;
  preference3: string;
  assignedSubject?: string;
  requestedSubject?: string;
};

const students: Student[] = [
  { id: 1, name: "Alice", preference1: "Mathematics", preference2: "Physics", preference3: "Chemistry" },
  { id: 2, name: "Bob", preference1: "Physics", preference2: "Mathematics", preference3: "Biology" },
  { id: 3, name: "Charlie", preference1: "Mathematics", preference2: "Chemistry", preference3: "Biology" },
  { id: 4, name: "David", preference1: "Chemistry", preference2: "Mathematics", preference3: "Physics" },
  { id: 5, name: "Emma", preference1: "Physics", preference2: "Chemistry", preference3: "Mathematics", assignedSubject: "Chemistry", requestedSubject: "Mathematics" },
  { id: 6, name: "Frank", preference1: "Mathematics", preference2: "Physics", preference3: "Chemistry", assignedSubject: "Physics", requestedSubject: "Mathematics" },
];

export default function SubjectPreferencePage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("unassigned");
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);

  const subject = "Mathematics"; // Dynamically fetched based on ID
  const maxSeats = 50;
  const remainingSeats = maxSeats - assignedStudents.length;

  // Get Unassigned Students
  const unassignedStudents = students
    .filter(s => !assignedStudents.find(a => a.id === s.id) && !s.assignedSubject)
    .sort((a, b) => {
      if (a.preference1 === subject) return -1;
      if (b.preference1 === subject) return 1;
      if (a.preference2 === subject) return -1;
      if (b.preference2 === subject) return 1;
      return 0;
    });

  // Change Request Students (who want to switch to this subject)
  const changeRequestStudents = students.filter(s => s.requestedSubject === subject);

  // Assigned Students
  const currentlyAssignedStudents = assignedStudents.filter(s => s.assignedSubject === subject);

  // Handle Accept (Allot Student)
  const handleAccept = (student: Student) => {
    if (remainingSeats > 0 && !assignedStudents.find(s => s.id === student.id)) {
      setAssignedStudents(prev => [...prev, { ...student, assignedSubject: subject }]);
    }
  };

  // Handle Reject (Remove Student)
  const handleReject = (studentId: number) => {
    setAssignedStudents(prev => prev.filter(s => s.id !== studentId));
  };

  // Handle "Allot All" Button
  const handleAllotAll = () => {
    if (remainingSeats > 0) {
      const studentsToAllot = unassignedStudents.slice(0, remainingSeats);
      setAssignedStudents(prev => [...prev, ...studentsToAllot.map(s => ({ ...s, assignedSubject: subject }))]);
    }
  };
  const handleAcceptChangeRequest = (student: Student) => {
    if (remainingSeats > 0) {
      setAssignedStudents(prev =>
        prev.map(s =>
          s.id === student.id ? { ...s, assignedSubject: student.requestedSubject, requestedSubject: undefined } : s
        )
      );
    }
  };
  
  const handleRejectChangeRequest = (studentId: number) => {
    setAssignedStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, requestedSubject: undefined } : s))
    );
  };
  

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title={`Subject Preferences - ${subject}`} />

        {/* Seats Info & Allot All Button in One Row */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <div className="flex space-x-4">
            <p className="text-lg font-semibold">Total Seats: {maxSeats}</p>
            <p className="text-lg font-semibold text-green-600">Remaining Seats: {remainingSeats}</p>
          </div>
          <button
            className={`px-4 py-2 rounded-md text-white ${remainingSeats > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
            onClick={handleAllotAll}
            disabled={remainingSeats <= 0}
          >
            Allot All
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b pb-2">
          {["unassigned", "assigned", "change-requests"].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 ${activeTab === tab ? "border-b-2 border-indigo-600 font-semibold" : "text-gray-600"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* Unassigned Students */}
          {activeTab === "unassigned" &&
            unassignedStudents.map(student => (
              <div key={student.id} className="border p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-600">Preference 1: {student.preference1}</p>
                  <p className="text-sm text-gray-600">Preference 2: {student.preference2}</p>
                  <p className="text-sm text-gray-600">Preference 3: {student.preference3}</p>
                </div>
                <div className="flex space-x-2">
                  {remainingSeats > 0 && (
                    <button className="px-3 py-1 bg-green-500 text-white rounded-md" onClick={() => handleAccept(student)}>
                      Allot
                    </button>
                  )}
                  <button className="px-3 py-1 bg-red-500 text-white rounded-md" onClick={() => handleReject(student.id)}>
                    Reject
                  </button>
                </div>
              </div>
            ))}

          {/* Assigned Students */}
          {activeTab === "assigned" &&
            currentlyAssignedStudents.map(student => (
              <div key={student.id} className="border p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-600">Assigned Subject: {student.assignedSubject}</p>
                </div>
                <button className="px-3 py-1 bg-red-500 text-white rounded-md" onClick={() => handleReject(student.id)}>
                  Remove
                </button>
              </div>
            ))}

          {/* Change Requests */}
{activeTab === "change-requests" &&
  changeRequestStudents.map(student => (
    <div key={student.id} className="border p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <p className="font-medium">{student.name}</p>
        <p className="text-sm text-gray-600">Currently Assigned: {student.assignedSubject}</p>
        <p className="text-sm text-blue-600">Requested Subject: {student.requestedSubject}</p>
      </div>
      <div className="flex space-x-2">
        {remainingSeats > 0 && (
          <button
            className="px-3 py-1 bg-green-500 text-white rounded-md"
            onClick={() => handleAcceptChangeRequest(student)}
          >
            Allot
          </button>
        )}
        <button
          className="px-3 py-1 bg-red-500 text-white rounded-md"
          onClick={() => handleRejectChangeRequest(student.id)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}

        </div>
      </div>
    </MainLayout>
  );
}
