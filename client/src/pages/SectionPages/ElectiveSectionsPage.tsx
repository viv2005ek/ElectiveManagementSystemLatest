import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import useSubjectCourseStudents, {
  ElectiveStudent,
} from "../../hooks/subjectHooks/useSubjectCourseStudents.ts";
import { useParams } from "react-router-dom";
import SectionStudentsTable from "../../components/tables/SectionStudentsTable.tsx";
import { useState } from "react";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import ToggleWithDescription from "../../components/FormComponents/ToggleWithDescription.tsx";

export default function ElectiveSectionsPage() {
  const { subjectCourseWithSeatsId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<ElectiveStudent[]>(
    [],
  );
  const { data, isLoading } = useSubjectCourseStudents(
    subjectCourseWithSeatsId,
    undefined,
    search,
    currentPage,
  );

  return (
    <MainLayout>
      <div className="p-6">
        <PageHeader
          title="Sections for Elective course"
          description="Manage sections of students for an elective course"
        />

        <div className={"flex flex-col gap-6 mt-6"}>
          <div className={"flex flex-row justify-between"}>
            <SearchBarWithDebounce value={search} setValue={setSearch} />
            <ToggleWithDescription
              enabled={selectionMode}
              setEnabled={setSelectionMode}
            />
          </div>
          <SectionStudentsTable
            selectionMode={selectionMode}
            students={data?.students || null}
            totalPages={data?.pagination.totalPages || 0}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={isLoading}
            label="Elective Course Students"
          />
        </div>
      </div>
    </MainLayout>
  );
}
