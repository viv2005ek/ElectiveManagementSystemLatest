import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import { useEffect, useState } from "react";
import useCreateSubjectType from "../hooks/subjectTypeHooks/useCreateSubjectType.ts";
import useFetchSubjectTypes, {
  SubjectScope,
  SubjectType,
} from "../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import SingleSelectMenu from "../components/FormComponents/SingleSelectMenu.tsx";
import useFetchSemesters, {
  Semester,
} from "../hooks/semesterHooks/useFetchSemesters.ts";
import MultiSelectMenu from "../components/FormComponents/MultiSelectMenu.tsx";
import useFetchBatches from "../hooks/batchHooks/useFetchBatches.ts";
import useFetchSubjectScopes from "../hooks/enumHooks/useFetchSubjectScopes.ts";
import SingleSelectEnumSelector from "../components/FormComponents/SingleSelectEnumSelector.tsx";
import useFetchDepartments, {
  Department,
} from "../hooks/departmentHooks/useFetchDepartments.ts";
import SingleSelectMenuWithSearch from "../components/FormComponents/SingleSelectMenuWithSearch.tsx";
import {
  Program,
  ProgramType,
  useFetchPrograms,
} from "../hooks/programHooks/useFetchPrograms.ts";
import useFetchFaculties, {
  Faculty,
} from "../hooks/facultyHooks/useFetchFaculties.ts";
import useFetchSchools, {
  School,
} from "../hooks/schoolHooks/useFetchSchools.ts";
import MultiSelectMenuWithSearch from "../components/FormComponents/MultiSelectMenuWithSearch.tsx";
import useFetchCourses from "../hooks/useFetchCourses.ts";
import { Course } from "../hooks/useFetchCourses.ts";
import useFetchCourseBuckets, {
  CourseBucket,
} from "../hooks/courseBucketHooks/useFetchCourseBuckets.ts";

export default function CreateSubjectPage() {
  const [name, setName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null,
  );
  const [selectedSemesters, setSelectedSemesters] = useState<Semester[]>([]);
  const [scope, setScope] = useState<string | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [programType, setProgramType] = useState<ProgramType | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const { semesters } = useFetchSemesters();
  const [selectedCourseBuckets, setSelectedCourseBuckets] = useState<
    CourseBucket[]
  >([]);
  const [subjectType, setSubjectType] = useState<SubjectType | null>(null);
  const { subjectTypes } = useFetchSubjectTypes();
  const { batches } = useFetchBatches();
  const { programs } = useFetchPrograms({
    departmentId: department?.id,
    programType: programType ?? undefined,
    facultyId: faculty?.id,
    schoolId: school?.id,
  });
  const { departments } = useFetchDepartments();
  const { faculties } = useFetchFaculties();
  const { schools } = useFetchSchools();
  const { courses } = useFetchCourses();
  const { courseBuckets } = useFetchCourseBuckets({
    departmentId: department?.id,
    schoolId: school?.id,
    facultyId: faculty?.id,
    subjectTypeId: subjectType?.id,
  });
  const [scopeFilter, setScopeFilter] = useState<string>("");

  useEffect(() => {
    if (subjectType) {
      switch (subjectType.scope) {
        case SubjectScope.ANY_DEPARTMENT:
          setDepartment(null);
          setSchool(null);
          setFaculty(null);
          break;
        case SubjectScope.SAME_DEPARTMENT:
          setSchool(null);
          setFaculty(null);
          break;
        case SubjectScope.SAME_FACULTY:
          setSchool(null);
          setDepartment(null);
          break;
        case SubjectScope.SAME_SCHOOL:
          setDepartment(null);
          setFaculty(null);
      }
    }
  }, [subjectType]);

  useEffect(() => {
    setSelectedPrograms([]);
  }, [department, faculty, school, programType, subjectType]);

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title={"Create Subject"} />
        <div
          className={"grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-12 mt-12"}
        >
          <TextInputField
            value={name}
            setValue={setName}
            placeholder={"Program Elective - V"}
            label={"Name"}
          />
          <SingleSelectMenu
            items={subjectTypes}
            selected={subjectType}
            setSelected={setSubjectType}
            label={"Subject type"}
          />
          <MultiSelectMenuWithSearch
            items={programs}
            selected={selectedPrograms}
            setSelected={setSelectedPrograms}
            label={"Programs"}
          />
          {subjectType?.scope === SubjectScope.SAME_DEPARTMENT && (
            <SingleSelectMenuWithSearch
              items={departments}
              selected={department}
              setSelected={setDepartment}
              label={"Department"}
            />
          )}
          {subjectType?.scope === SubjectScope.SAME_FACULTY && (
            <SingleSelectMenuWithSearch
              items={faculties}
              selected={faculty}
              setSelected={setFaculty}
              label={"Faculty"}
            />
          )}
          {subjectType?.scope === SubjectScope.SAME_SCHOOL && (
            <SingleSelectMenuWithSearch
              items={schools}
              selected={school}
              setSelected={setSchool}
              label={"School"}
            />
          )}
          {subjectType?.allotmentType === "Standalone" && (
            <>
              <SingleSelectMenu
                prefix={"Semester"}
                items={semesters}
                selected={selectedSemester}
                setSelected={setSelectedSemester}
                label={"Semester"}
              />
              <MultiSelectMenuWithSearch
                items={courses}
                selected={selectedCourses}
                setSelected={setSelectedCourses}
                label={"Options for Courses"}
              />
            </>
          )}
          {subjectType?.allotmentType === "Bucket" && (
            <>
              <MultiSelectMenu
                prefix={"Semester"}
                items={semesters}
                selected={selectedSemesters}
                setSelected={setSelectedSemesters}
                label={"Semesters"}
              />
              <MultiSelectMenuWithSearch
                items={courseBuckets}
                selected={selectedCourseBuckets}
                setSelected={setSelectedCourseBuckets}
                label={"Options for Course Buckets"}
              />
            </>
          )}
        </div>
        <button
          className={
            "bg-blue-400 w-full p-2 rounded-lg hover:bg-blue-300 mt-12 text-white"
          }
        >
          Create
        </button>
      </div>
    </MainLayout>
  );
}
