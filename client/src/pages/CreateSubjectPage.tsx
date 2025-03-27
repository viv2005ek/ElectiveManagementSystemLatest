import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import {useEffect, useState} from "react";
import useFetchSubjectTypes, {
  AllotmentType,
  SubjectScope,
  SubjectType,
} from "../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import SingleSelectMenu from "../components/FormComponents/SingleSelectMenu.tsx";
import useFetchSemesters, {Semester,} from "../hooks/semesterHooks/useFetchSemesters.ts";
import MultiSelectMenu from "../components/FormComponents/MultiSelectMenu.tsx";
import useFetchBatches from "../hooks/batchHooks/useFetchBatches.ts";
import useFetchDepartments, {Department,} from "../hooks/departmentHooks/useFetchDepartments.ts";
import SingleSelectMenuWithSearch from "../components/FormComponents/SingleSelectMenuWithSearch.tsx";
import {Program, useFetchPrograms,} from "../hooks/programHooks/useFetchPrograms.ts";
import useFetchFaculties, {Faculty,} from "../hooks/facultyHooks/useFetchFaculties.ts";
import useFetchSchools, {School,} from "../hooks/schoolHooks/useFetchSchools.ts";
import MultiSelectMenuWithSearch from "../components/FormComponents/MultiSelectMenuWithSearch.tsx";
import useFetchCourses, {Course} from "../hooks/useFetchCourses.ts";
import useFetchCourseBuckets, {CourseBucket,} from "../hooks/courseBucketHooks/useFetchCourseBuckets.ts";

interface CourseWithSeat {
  selectedCourse: Course
  seats: number
}
export default function CreateSubjectPage() {
  const [name, setName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null,
  );
  const [selectedSemesters, setSelectedSemesters] = useState<Semester[]>([]);
  const [selectedCoursesWithSeats, setSelectedCoursesWithSeats] = useState<CourseWithSeat[]>([])
  const [school, setSchool] = useState<School | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  // const [programType, setProgramType] = useState<ProgramType | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [selectedCourseBuckets, setSelectedCourseBuckets] = useState<
    CourseBucket[]
  >([]);
  const [subjectType, setSubjectType] = useState<SubjectType | null>(null);
  const { subjectTypes } = useFetchSubjectTypes();


  const { batches } = useFetchBatches();
  const { semesters } = useFetchSemesters();
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
  const { programs } = useFetchPrograms({
    departmentId: department?.id,
    // programType: programType ?? undefined,
    facultyId: faculty?.id,
    schoolId: school?.id,
  });

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
    setSelectedCoursesWithSeats(
        selectedCourses.map(course => ({
          selectedCourse: course,
          seats: 0, // Default seat value
        }))
    );
  }, [selectedCourses]);


  useEffect(() => {
    setSelectedPrograms([]);
  }, [department, faculty, school, subjectType]);

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
        <div className={'mt-8 mb-2 font-semibold text-sm'}>Course-Seat Mapping</div>
        <table className="w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left rounded-tl-lg">S.no</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {subjectType?.allotmentType === AllotmentType.BUCKET ? "Course Bucket name" : "Course name"}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center rounded-tr-lg">Seats</th>
          </tr>
          </thead>
          <tbody>
          {subjectType?.allotmentType === AllotmentType.STANDALONE && selectedCoursesWithSeats.length > 0 ? (
              selectedCoursesWithSeats.map((courseWithSeat, index, arr) => (
                  <tr key={courseWithSeat.selectedCourse.id} className="even:bg-gray-100 text-xs">
                    <td className={`border border-gray-300 px-4 py-2 ${index === arr.length - 1 ? "rounded-bl-lg" : ""}`}>
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{courseWithSeat.selectedCourse.name}</td>
                    <td className={`border border-gray-300 px-4 py-2 text-center ${index === arr.length - 1 ? "rounded-br-lg" : ""}`}>
                      <input
                          type="number"
                          className="w-20 text-center border border-gray-400 rounded-md p-1 text-xs"
                          value={courseWithSeat.seats}
                          onChange={(e) => {
                            const newSeats = parseInt(e.target.value, 10) || 0;
                            setSelectedCoursesWithSeats(prev =>
                                prev.map(cws =>
                                    cws.selectedCourse.id === courseWithSeat.selectedCourse.id
                                        ? { ...cws, seats: newSeats }
                                        : cws
                                )
                            );
                          }}
                      />
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500 text-sm font-semibold">
                  No courses added yet
                </td>
              </tr>
          )}
          </tbody>
        </table>

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
