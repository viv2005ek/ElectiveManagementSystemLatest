import { useState } from "react";
import allUsers from "../store/allStudentData";
import InfoStudentPopUp from "./InfoStudentPopUp";

export default function AllStudentList() {
  const students = allUsers;

  const [search, setSearch] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterSemester, setFilterSemester] = useState<string>("");
  const [selectedRegistrationNo, setSelectedRegistrationNo] = useState<string | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.registrationNo.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = filterDepartment
      ? student.departmentName === filterDepartment
      : true;
    const matchesSemester = filterSemester
      ? student.semester === filterSemester
      : true;

    return matchesSearch && matchesDepartment && matchesSemester;
  });

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">All Students List</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or registration number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto flex-1"
        />

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto flex-1"
        >
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">Mechanical</option>
          <option value="IT">IT</option>
          <option value="CE">Civil</option>
        </select>

        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto flex-1"
        >
          <option value="">All Semesters</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>
      </div>

      <ul className="space-y-4">
        {filteredStudents.map((student, index) => (
          <li
            key={index}
            onClick={() => setSelectedRegistrationNo(student.registrationNo)}
            className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-md flex flex-col justify-between items-start"
          >
            <p className="text-lg font-semibold">
              {student.name} - {student.registrationNo}
            </p>
            <p className="text-sm">
              Department: {student.departmentName} | Semester: {student.semester}
            </p>
            <p className="text-sm">
              Elective: {student.elective.subject} ({student.elective.credits} Credits)
            </p>
          </li>
        ))}
      </ul>

      <InfoStudentPopUp
        registrationNo={selectedRegistrationNo}
        onClose={() => setSelectedRegistrationNo(null)}
      />
    </div>
  );
}
