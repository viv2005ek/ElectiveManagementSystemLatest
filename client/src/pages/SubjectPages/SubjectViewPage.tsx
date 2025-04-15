import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import useFetchSubjectInfo, {
  CourseBucketWithSeats,
  CourseWithSeats,
} from "../../hooks/subjectHooks/useFetchSubjectInfo.ts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <PageHeader title={"Subject Details"} />
            <button
              onClick={() => setViewMode(!viewMode)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                viewMode 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150`}
            >
              {viewMode ? (
                <>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </>
              )}
            </button>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
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
              </div>
              
              <div className="space-y-6">
                {renderScopeSetter()}
                <MultiSelectMenuWithSearch
                  label={"Programs"}
                  disabled={viewMode}
                  items={programs}
                  selected={selectedPrograms}
                  setSelected={setSelectedPrograms}
                />
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Programs</h3>
                <ProgramsTable
                  programs={data?.programs}
                  loading={loading}
                  label={""}
                  showActionButtons={false}
                />
              </div>
              
              {data?.subjectType.allotmentType === AllotmentType.STANDALONE && (
                <CoursesWithSeatsTable
                  courses={courses}
                  coursesWithSeats={selectedCoursesWithSeats}
                  setCoursesWithSeats={setSelectedCoursesWithSeats}
                  isLoading={loading}
                  viewMode={viewMode}
                  label={"Courses"}
                />
              )}
              
              {data?.subjectType.allotmentType === AllotmentType.BUCKET && (
                <CourseBucketsWithSeatsTable
                  label={"Course Buckets"}
                  courseBucketsWithSeats={data.courseBucketsWithSeats}
                  isLoading={loading}
                />
              )}
            </div>
            
            {!viewMode && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
