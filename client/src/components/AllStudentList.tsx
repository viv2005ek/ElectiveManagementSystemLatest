import { useState,useEffect } from "react";

type Elective = {
  subject: string;
  credits: number;
};

type Student = {
  name: string;
  regNo: string;
  semester: string;
  department: string;
  elective: Elective;
};

export default function AllStudentList() {
  const students: Student[] = [
    { name: "John Doe", regNo: "BTECH1234", semester: "5", department: "CSE", elective: { subject: "Data Science", credits: 3 } },
    { name: "Jane Smith", regNo: "BTECH5678", semester: "3", department: "ECE", elective: { subject: "AI Basics", credits: 2 } },
    { name: "Mike Johnson", regNo: "BTECH9101", semester: "7", department: "ME", elective: { subject: "Robotics", credits: 4 } },
    { name: "Sara Brown", regNo: "BTECH1123", semester: "1", department: "IT", elective: { subject: "Cybersecurity", credits: 3 } },
    { name: "Robert Green", regNo: "BTECH1617", semester: "6", department: "CSE", elective: { subject: "Machine Learning", credits: 3 } },
{ name: "Laura Black", regNo: "BTECH1819", semester: "2", department: "ECE", elective: { subject: "Embedded Systems", credits: 2 } },
{ name: "Chris Adams", regNo: "BTECH2021", semester: "4", department: "ME", elective: { subject: "Thermodynamics", credits: 3 } },
{ name: "Amy Clark", regNo: "BTECH2223", semester: "8", department: "IT", elective: { subject: "Cloud Computing", credits: 4 } },
{ name: "David Lewis", regNo: "BTECH2425", semester: "5", department: "CE", elective: { subject: "Environmental Science", credits: 3 } },
{ name: "Rachel Wilson", regNo: "BTECH2627", semester: "3", department: "CSE", elective: { subject: "Web Development", credits: 2 } },
{ name: "Brian Martinez", regNo: "BTECH2829", semester: "1", department: "ECE", elective: { subject: "Digital Electronics", credits: 3 } },
{ name: "Olivia Scott", regNo: "BTECH3031", semester: "7", department: "ME", elective: { subject: "Fluid Mechanics", credits: 4 } },
{ name: "Jack Thomas", regNo: "BTECH3233", semester: "6", department: "IT", elective: { subject: "Data Privacy", credits: 3 } },
{ name: "Sophia Turner", regNo: "BTECH3435", semester: "2", department: "CE", elective: { subject: "Geotechnical Engineering", credits: 2 } },
{ name: "Liam Evans", regNo: "BTECH3637", semester: "5", department: "CSE", elective: { subject: "Artificial Intelligence", credits: 3 } },
{ name: "Mia Roberts", regNo: "BTECH3839", semester: "4", department: "ECE", elective: { subject: "Signal Processing", credits: 3 } },
{ name: "Ethan Baker", regNo: "BTECH4041", semester: "8", department: "ME", elective: { subject: "Manufacturing Processes", credits: 4 } },
{ name: "Ava King", regNo: "BTECH4243", semester: "3", department: "IT", elective: { subject: "Network Security", credits: 2 } },
{ name: "Benjamin Lee", regNo: "BTECH4445", semester: "1", department: "CE", elective: { subject: "Engineering Graphics", credits: 3 } }

  ];

  const [search, setSearch] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterSemester, setFilterSemester] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.regNo.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = filterDepartment ? student.department === filterDepartment : true;
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
      document.body.style.overflow = ""; // Always restore when component unmounts
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
          <option value="3">Semester 3</option>
          <option value="5">Semester 5</option>
          <option value="7">Semester 7</option>
        </select>
      </div>

      <ul className="space-y-4">
        {filteredStudents.map((student, index) => (
          <li
            key={index}
            onClick={() => setSelectedStudent(student)}
            className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-md flex flex-col justify-between items-start"
          >
            <p className="text-lg font-semibold">{student.name} - {student.regNo}</p>
            <p className="text-sm">Department: {student.department} | Semester: {student.semester}</p>
            <p className="text-sm">Elective: {student.elective.subject} ({student.elective.credits} Credits)</p>
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              style={{scale:"1.75"}}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2">Student Details</h2>
            <p className="mb-1"><strong>Name:</strong> {selectedStudent.name}</p>
            <p className="mb-1"><strong>Registration Number:</strong> {selectedStudent.regNo}</p>
            <p className="mb-1"><strong>Department:</strong> {selectedStudent.department}</p>
            <p className="mb-1"><strong>Semester:</strong> {selectedStudent.semester}</p>
            <p className="mb-1"><strong>Open Elective:</strong> {selectedStudent.elective.subject}</p>
            <p><strong>Credits:</strong> {selectedStudent.elective.credits}</p>
          </div>
        </div>
      )}
    </div>
  );
}
