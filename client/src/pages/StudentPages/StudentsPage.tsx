import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import StudentsTable from "../../components/tables/StudentsTable.tsx";
import { useFetchStudents } from "../../hooks/studentHooks/useFetchStudents.ts";
import { useEffect, useState } from "react";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import useFetchDepartments, {
  Department,
} from "../../hooks/departmentHooks/useFetchDepartments.ts";
import useFetchSemesters, {
  Semester,
} from "../../hooks/semesterHooks/useFetchSemesters.ts";
import useFetchBatches, {
  Batch,
} from "../../hooks/batchHooks/useFetchBatches.ts";
import {
  Program,
  useFetchPrograms,
} from "../../hooks/programHooks/useFetchPrograms.ts";
import useFetchSchools, {
  School,
} from "../../hooks/schoolHooks/useFetchSchools.ts";
import { Link } from "react-router-dom";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";

export default function StudentsPage() {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [school, setSchool] = useState<School | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);

  const { departments } = useFetchDepartments();
  const { semesters } = useFetchSemesters();
  const { batches } = useFetchBatches();
  const { schools } = useFetchSchools();
  const { programs } = useFetchPrograms();

  const { students, totalPages, loading } = useFetchStudents({
    search: searchQuery,
    batchId: batch?.id,
    programId: program?.id,
    semesterId: semester?.id,
    departmentId: department?.id,
    schoolId: school?.id,
    page: currentPage,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, batch, program, semester, department, school]);

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title="Students" />

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="h-[42px]">
                  <SearchBarWithDebounce
                    value={searchQuery}
                    setValue={setSearchQuery}
                    placeholder="Search by name or registration number"
                  />
                </div>
              </div>
              <div>
                <SingleSelectMenu
                  label="School"
                  items={schools}
                  selected={school}
                  setSelected={setSchool}
                  name="school"
                />
              </div>
              <div>
                <SingleSelectMenu
                  label="Department"
                  items={departments}
                  selected={department}
                  setSelected={setDepartment}
                  name="department"
                />
              </div>
              <div>
                <SingleSelectMenu
                  label="Program"
                  items={programs}
                  selected={program}
                  setSelected={setProgram}
                  name="program"
                />
              </div>
              <div>
                <SingleSelectMenu
                  label="Batch"
                  items={batches}
                  selected={batch}
                  setSelected={setBatch}
                  name="batch"
                />
              </div>
              <div>
                <SingleSelectMenu
                  label="Semester"
                  items={semesters}
                  selected={semester}
                  setSelected={setSemester}
                  name="semester"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <Link
              to="/students/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Student
            </Link>
          </div>

          <StudentsTable
            students={students}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            isLoading={loading}
            label="Student List"
          />
        </div>
      </div>
    </MainLayout>
  );
}
