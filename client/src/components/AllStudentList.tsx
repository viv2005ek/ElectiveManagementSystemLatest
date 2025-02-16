import { useEffect, useState } from "react";
import InfoStudentPopUp from "./InfoStudentPopUp";
import axiosInstance from "../axiosInstance.ts";



interface Student {
  name: string;
  registrationNo: string;
  departmentName: string;
  semester: number;
  id: string;
}

export default function AllStudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterSemester, setFilterSemester] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get("/students");
        const data = response.data;

        const formattedStudents: Student[] = data.map((student: any) => ({
          name: `${student.firstName} ${student.lastName}`,
          registrationNo: student.registrationNumber,
          departmentName: student.branch?.department?.name || "Unknown",
          semester: student.semester,
          id: student.id,
        }));

        setStudents(formattedStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.registrationNo.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = filterDepartment
      ? student.departmentName === filterDepartment
      : true;
    const matchesSemester = filterSemester
      ? student.semester === parseInt(filterSemester, 10)
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
          {[...new Set(students.map((s) => s.departmentName))].map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto flex-1"
        >
          <option value="">All Semesters</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {filteredStudents.map((student) => (
          <li
            key={student.id}
            onClick={() => setSelectedId(student.id)}
            className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-md flex flex-col justify-between items-start transition-all hover:bg-gray-100 hover:shadow-lg"
          >
            <p className="text-lg font-semibold text-gray-800">
              {student.name} - {student.registrationNo}
            </p>
            <p className="text-sm text-gray-600">
              Department: <span className="font-medium">{student.departmentName}</span> | Semester: <span
              className="font-medium">{student.semester}</span>
            </p>
          </li>
        ))}
      </ul>

      {selectedId && (
        <InfoStudentPopUp id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
