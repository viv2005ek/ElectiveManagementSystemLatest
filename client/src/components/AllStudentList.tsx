import { useState, useEffect } from "react";
import allUsers from "../store/allStudentData";

type Elective = {
  subject: string;
  credits: number;
};

type Student = {
  name: string;
  registrationNo: string;  // Updated to match the data
  mobileNo1: string;
  mobileNo2: string;
  departmentName: string;
  branchName: string;
  semester: string;
  classCoordinator: boolean;
  profilePic: string | null;
  classCoordinatorName: string;
  mailId: string;
  section: string;
  batchNo: string;
  gender: string;
  elective: Elective;
};

export default function AllStudentList() {
  const students: Student[] = allUsers;

  const [search, setSearch] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterSemester, setFilterSemester] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.registrationNo.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = filterDepartment ? student.departmentName === filterDepartment : true;
    const matchesSemester = filterSemester ? student.semester === filterSemester : true;

    return matchesSearch && matchesDepartment && matchesSemester;
  });

  useEffect(() => {
    if (selectedStudent) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = ""; 
    }
    return () => {
      document.body.style.overflow = ""; 
    };
  }, [selectedStudent]);

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
            onClick={() => setSelectedStudent(student)}
            className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-md flex flex-col justify-between items-start"
          >
            <p className="text-lg font-semibold">{student.name} - {student.registrationNo}</p>
            <p className="text-sm">Department: {student.departmentName} | Semester: {student.semester}</p>
            <p className="text-sm">Elective: {student.elective.subject} ({student.elective.credits} Credits)</p>
          </li>
        ))}
      </ul>

      {selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
      <button
        onClick={() => setSelectedStudent(null)}
        className="absolute top-2 right-5 text-gray-500 hover:text-gray-700"
        style={{ scale: "1.75" }}
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-2">Student Details</h2>

      <p className="mb-1"><strong>Name:</strong> {selectedStudent.name}</p>
      <p className="mb-1"><strong>Registration Number:</strong> {selectedStudent.registrationNo}</p>
      <p className="mb-1"><strong>Mobile Number 1:</strong> {selectedStudent.mobileNo1}</p>
      <p className="mb-1"><strong>Mobile Number 2:</strong> {selectedStudent.mobileNo2}</p>
      <p className="mb-1"><strong>Department:</strong> {selectedStudent.departmentName}</p>
      <p className="mb-1"><strong>Branch:</strong> {selectedStudent.branchName}</p>
      <p className="mb-1"><strong>Semester:</strong> {selectedStudent.semester}</p>
      <p className="mb-1"><strong>Class Coordinator:</strong> {selectedStudent.classCoordinator ? "Yes" : "No"}</p>
      <p className="mb-1"><strong>Class Coordinator Name:</strong> {selectedStudent.classCoordinatorName}</p>
      <p className="mb-1"><strong>Email:</strong> {selectedStudent.mailId}</p>
      <p className="mb-1"><strong>Section:</strong> {selectedStudent.section}</p>
      <p className="mb-1"><strong>Batch Number:</strong> {selectedStudent.batchNo}</p>
      <p className="mb-1"><strong>Gender:</strong> {selectedStudent.gender}</p>
      
      <h3 className="text-lg font-semibold mt-4">Elective Details:</h3>
      <p className="mb-1"><strong>Subject:</strong> {selectedStudent.elective.subject}</p>
      <p><strong>Credits:</strong> {selectedStudent.elective.credits}</p>

      {/* If the student has a profile picture, display it */}
      {selectedStudent.profilePic && (
        <div className="mt-4">
          <img
            src={selectedStudent.profilePic}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}
