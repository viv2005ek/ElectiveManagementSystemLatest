import MainLayout from '../layouts/MainLayout.tsx';
import PageHeader from '../components/PageHeader.tsx';
import StudentsTable from '../components/tables/StudentsTable.tsx';
import { useFetchStudents } from '../hooks/studentHooks/useFetchStudents.ts';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBarWithDebounce from '../components/SearchBarWithDebounce.tsx';
import useFetchDepartments, { Department } from '../hooks/departmentHooks/useFetchDepartments.ts';
import useFetchSemesters, { Semester } from '../hooks/semesterHooks/useFetchSemesters.ts';
import useFetchBatches, { Batch } from '../hooks/batchHooks/useFetchBatches.ts';
import { Program } from '../hooks/programHooks/useFetchPrograms.ts';
import useFetchSchools, { School } from '../hooks/schoolHooks/useFetchSchools.ts';

export default function StudentsPage() {
  // const [department, setDepartment] = useState<Department | null>(null);
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
  }, [searchQuery]);

  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Students"} />
        <div className={"flex flex-row my-8 items-center justify-center"}>
          <div className={"flex flex-row gap-4 items-end"}>
            <SearchBarWithDebounce
              value={searchQuery}
              setValue={setSearchQuery}
            />
            {/*<SingleSelectMenu items={batches} selected={batch} setSelected={setBatch}/>*/}
            {/*<SingleSelectMenu items={semesters} selected={semester} setSelected={setSemester}/>*/}
            {/*<SingleSelectMenu items={departments} selected={department} setSelected={setDepartment}/>*/}
          </div>
          <div className={"flex flex-row flex-grow justify-end"}>
            <Link to={"/branches/create"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Add student
              </button>
            </Link>
          </div>
        </div>
        <StudentsTable
          students={students}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          isLoading={loading}
        />
      </div>
    </MainLayout>
  );
}
