import MainLayout from '../layouts/MainLayout.tsx';
import PageHeader from '../components/PageHeader.tsx';
import StudentsTable from '../components/tables/StudentsTable.tsx';
import { useFetchStudents } from '../hooks/useFetchStudents.ts';
import { useState } from 'react';
import { useDepartments } from '../hooks/useDepartments.ts';
import useBranches, { Branch } from '../hooks/useBranches.ts';
import { Link } from 'react-router-dom';
import SingleSelectFilterForIds from '../components/filters/SingleSelectFilterForIds.tsx';
import SearchBar from '../components/SearchBar.tsx';
import { getBatches, getSemesters } from '../utils/generateObjectArrays.ts';
import SingleSelectFilterForNumbers from '../components/filters/SingleSelectFilterForNumbers.tsx';

export default function StudentsPage() {
  // const [department, setDepartment] = useState<Department | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [batch, setBatch] = useState<number | null>(null);
  const [semester, setSemester] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { departments } = useDepartments();
  const { branches } = useBranches(true, null);
  const semesters = getSemesters(8);
  const batches = getBatches(5, 5);

  const { students } = useFetchStudents(
    // department,
    branch,
    batch,
    semester,
    searchQuery,
  );
  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Students"} />
        <div className={"flex flex-row my-8 items-center justify-center"}>
          <div className={"flex flex-row gap-4 items-end"}>
            <SearchBar value={searchQuery} setValue={setSearchQuery} />
            <SingleSelectFilterForIds
              name={"Branch"}
              items={branches}
              selected={branch}
              setSelected={setBranch}
            />
            <SingleSelectFilterForNumbers
              name={"Semesters"}
              items={semesters}
              selected={semester}
              setSelected={setSemester}
            />
            <SingleSelectFilterForNumbers
              name={"Batches"}
              items={batches}
              selected={batch}
              setSelected={setBatch}
            />
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
        <StudentsTable students={students} />
      </div>
    </MainLayout>
  );
}
