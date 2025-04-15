import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import useFetchSubjectInfo, {
  CourseBucketWithSeats,
  CourseWithSeats,
} from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";
import useFetchSubjectTypes, {
  AllotmentType,
  SubjectScope,
  SubjectType,
} from "../../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import useFetchSemesters, {
  Semester,
} from "../../hooks/semesterHooks/useFetchSemesters.ts";
import MultiSelectMenu from "../../components/FormComponents/MultiSelectMenu.tsx";
import useFetchBatches, {
  Batch,
} from "../../hooks/batchHooks/useFetchBatches.ts";
import useFetchDepartments, {
  Department,
} from "../../hooks/departmentHooks/useFetchDepartments.ts";
import useFetchSchools, {
  School,
} from "../../hooks/schoolHooks/useFetchSchools.ts";
import useFetchFaculties, {
  Faculty,
} from "../../hooks/facultyHooks/useFetchFaculties.ts";
import {
  Program,
  useFetchPrograms,
} from "../../hooks/programHooks/useFetchPrograms.ts";
import MultiSelectMenuWithSearch from "../../components/FormComponents/MultiSelectMenuWithSearch.tsx";
import ProgramsTable from "../../components/tables/ProgramsTable.tsx";
import CoursesWithSeatsTable from "../../components/tables/CoursesWithSeatsTable.tsx";
import CourseBucketsWithSeatsTable from "../../components/tables/CourseBucketsWithSeatsTable.tsx";
import useFetchCourseBuckets from "../../hooks/courseBucketHooks/useFetchCourseBuckets.ts";
import useUpdateSubject from "../../hooks/subjectHooks/useUpdateSubject.ts";
import useFetchCourses from "../../hooks/courseHooks/useFetchCourses.ts";

export default function SubjectViewPage() {
  const { id } = useParams();

  const { data, loading, fetchSubjectInfo, error } = useFetchSubjectInfo(id);

  const [viewMode, setViewMode] = useState(true);
  const [name, setName] = useState("");
  const [subjectType, setSubjectType] = useState<SubjectType | null>(null);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [selectedSemesters, setSelectedSemesters] = useState<Semester[]>([]);

  const [selectedCoursesWithSeats, setSelectedCoursesWithSeats] = useState<
    CourseWithSeats[]
  >([]);
  const [coursesPage, setCoursesPage] = useState(1);
  const [courseBucketsWithSeats, setCourseBucketsWithSeats] = useState<
    CourseBucketWithSeats[]
  >([]);
  const [offeringsSearch, setOfferingsSearch] = useState("");
  const { subjectTypes } = useFetchSubjectTypes();
  const { batches } = useFetchBatches();
  const { programs } = useFetchPrograms({ departmentId: department?.id });
  const { schools } = useFetchSchools();
  const { semesters } = useFetchSemesters();
  const { departments } = useFetchDepartments();
  const { faculties } = useFetchFaculties();

  const { courses } = useFetchCourses({
    semesterId: semester?.id,
    category: subjectType,
  });
  const { data: courseBucketsData } = useFetchCourseBuckets({
    page: coursesPage,
    departmentId: department?.id,
    schoolId: school?.id,
    facultyId: faculty?.id,
    subjectTypeId: subjectType?.id,
    numberOfCourses: data?.numberOfCoursesInBucket,
  });

  const { updateSubject } = useUpdateSubject();

  useEffect(() => {
    if (!data) return;
    setName(data.name);
    setSubjectType(data.subjectType);
    setSemester(data.semester);
    setBatch(data.batch);
    setDepartment(data.department);
    setSelectedPrograms(data.programs);
    setSelectedSemesters(data.semesters);
    setSelectedCoursesWithSeats(data.coursesWithSeats);
  }, [data]);

  const handleSave = async () => {
    if (!id) return;

    const payload = {
      name,
      batchId: batch?.id,
      subjectTypeId: subjectType?.id,
      semesterId: semester?.id,
      departmentId: department?.id,
      schoolId: school?.id,
      facultyId: faculty?.id,
      programIds: selectedPrograms.map((program) => program.id),
      coursesWithSeats: selectedCoursesWithSeats.map((course) => ({
        id: course.course.id,
        seats: course.totalSeats,
      })),
    };

    const success = await updateSubject(id, payload);

    if (success) {
      fetchSubjectInfo();
      setViewMode(true);
    }
  };

  const renderScopeSetter = () => {
    switch (data?.subjectType.scope) {
      case SubjectScope.SAME_DEPARTMENT:
        return (
          <SingleSelectMenu
            items={departments}
            label={"Department"}
            disabled={viewMode}
            selected={department}
            setSelected={setDepartment}
          />
        );
      case SubjectScope.SAME_SCHOOL:
        return (
          <SingleSelectMenu
            label={"School"}
            items={schools}
            disabled={viewMode}
            selected={school}
            setSelected={setSchool}
          />
        );
      case SubjectScope.SAME_FACULTY:
        return (
          <SingleSelectMenu
            label={"Faculty"}
            disabled={viewMode}
            items={faculties}
            selected={faculty}
            setSelected={setFaculty}
          />
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className={"mt-8"}>
        <PageHeader title={"Subject Details"} />
        <div className={"flex flex-row justify-end mt-8"}>
          <button
            onClick={() => setViewMode(!viewMode)}
            className={`flex flex-row text-white ${viewMode ? "bg-blue-500" : "bg-red-500"} py-1 hover:bg-opacity-80 hover:shadow-md transition-all px-4 rounded-lg gap-4 text-lg font-semibold items-center`}
          >
            <div>{viewMode ? "Edit" : "Cancel"}</div>
            {viewMode && <PencilIcon className={"h-5 w-5 stroke-2"} />}
          </button>
        </div>

        <div className={" grid grid-cols-2 gap-x-32 gap-y-12"}>
          <TextInputField
            label={"Subject name"}
            disabled={viewMode}
            value={name}
            setValue={setName}
          />
          <SingleSelectMenu
            label={"Batch"}
            prefix={"Batch of"}
            items={batches}
            selected={batch}
            disabled={viewMode}
            setSelected={setBatch}
          />
          <SingleSelectMenu
            disabled={viewMode}
            label={"Subject Type"}
            items={subjectTypes}
            selected={subjectType}
            setSelected={setSubjectType}
          />
          {subjectType?.allotmentType === AllotmentType.STANDALONE && (
            <SingleSelectMenu
              label={"Semester"}
              prefix={"Semester"}
              disabled={viewMode}
              items={semesters}
              selected={semester}
              setSelected={setSemester}
            />
          )}
          {subjectType?.allotmentType === AllotmentType.BUCKET && (
            <MultiSelectMenu
              label={"Semesters"}
              prefix={"Semesters"}
              disabled={viewMode}
              items={semesters}
              selected={selectedSemesters}
              setSelected={setSelectedSemesters}
            />
          )}
          {renderScopeSetter()}
          <MultiSelectMenuWithSearch
            label={"Programs"}
            disabled={viewMode}
            items={programs}
            selected={selectedPrograms}
            setSelected={setSelectedPrograms}
          />
          <div className={"col-span-2 my-8"}>
            <ProgramsTable
              programs={data?.programs}
              loading={loading}
              label={"Programs"}
              showActionButtons={false}
            />
            {data?.subjectType.allotmentType === AllotmentType.STANDALONE && (
              <>
                <CoursesWithSeatsTable
                  courses={courses}
                  coursesWithSeats={selectedCoursesWithSeats}
                  setCoursesWithSeats={setSelectedCoursesWithSeats}
                  isLoading={loading}
                  viewMode={viewMode}
                  label={"Courses"}
                />
              </>
            )}
            {data?.subjectType.allotmentType === AllotmentType.BUCKET && (
              <>
                <CourseBucketsWithSeatsTable
                  label={"Course Buckets"}
                  courseBucketsWithSeats={data.courseBucketsWithSeats}
                  isLoading={loading}
                />
              </>
            )}
          </div>
        </div>
        {!viewMode && (
          <button
            onClick={handleSave}
            className={"w-full p-2 bg-blue-400 text-white rounded-lg my-8"}
          >
            Save
          </button>
        )}
      </div>
    </MainLayout>
  );
}
