import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import { useEffect, useState } from "react";
import useFetchSubjectTypes, {
  AllotmentType,
  SubjectScope,
  SubjectType,
} from "../../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";
import useFetchSemesters, {
  Semester,
} from "../../hooks/semesterHooks/useFetchSemesters.ts";
import useFetchBatches, {
  Batch,
} from "../../hooks/batchHooks/useFetchBatches.ts";
import useFetchDepartments, {
  Department,
} from "../../hooks/departmentHooks/useFetchDepartments.ts";
import {
  Program,
  ProgramType,
  useFetchPrograms,
} from "../../hooks/programHooks/useFetchPrograms.ts";
import useFetchFaculties, {
  Faculty,
} from "../../hooks/facultyHooks/useFetchFaculties.ts";
import useFetchSchools, {
  School,
} from "../../hooks/schoolHooks/useFetchSchools.ts";
import useFetchCourses, {
  Course,
} from "../../hooks/courseHooks/useFetchCourses.ts";
import useFetchCourseBuckets, {
  CourseBucket,
} from "../../hooks/courseBucketHooks/useFetchCourseBuckets.ts";
import NumberInputField from "../../components/FormComponents/NumberInputField.tsx";
import SingleSelectMenuAlternate from "../../components/FormComponents/SingleSelectMenuAlternate.tsx";
import useFetchProgramTypes from "../../hooks/programHooks/useFetchProgramTypes.ts";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import useCreateSubject from "../../hooks/subjectHooks/useCreateSubject.ts";
import ProgramsTable from "../../components/tables/ProgramsTable.tsx";
import CourseBucketsTable from "../../components/tables/CourseBucketsTable.tsx";
import CoursesTable from "../../components/tables/CoursesTable.tsx";
import SingleSelectEnumSelector from "../../components/FormComponents/SingleSelectEnumSelector.tsx";

interface CourseWithSeat {
  selectedCourse: Course;
  seats: number;
}

interface CourseBucketWithSeat {
  selectedBucket: CourseBucket;
  seats: number;
}

export default function CreateSubjectPage() {
  const [name, setName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null,
  );

  const [selectedSemesters, setSelectedSemesters] = useState<Semester[]>([]);
  const [selectedCoursesWithSeats, setSelectedCoursesWithSeats] = useState<
    CourseWithSeat[]
  >([]);
  const [selectedCourseBucketsWithSeats, setSelectedCourseBucketsWithSeats] =
    useState<CourseBucketWithSeat[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [coursesCurrentPage, setCoursesCurrentPage] = useState(1);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [selectedProgramType, setSelectedProgramType] =
    useState<ProgramType | null>(null);
  const [selectedCourseBuckets, setSelectedCourseBuckets] = useState<
    CourseBucket[]
  >([]);
  const [numberOfCoursesInABucket, setNumberOfCoursesInABucket] = useState<
    number | undefined
  >();
  const [subjectType, setSubjectType] = useState<SubjectType | null>(null);
  const { subjectTypes } = useFetchSubjectTypes();

  const { notify } = useNotification();

  const { batches } = useFetchBatches();
  const { semesters } = useFetchSemesters();
  const { departments } = useFetchDepartments();
  const { faculties } = useFetchFaculties();
  const { schools } = useFetchSchools();
  const {
    courses,
    totalPages: coursesTotalPages,
    loading: coursesLoading,
  } = useFetchCourses({
    page: coursesCurrentPage,
    departmentId: department?.id,
  });
  const { programTypes, loading: programsLoading } = useFetchProgramTypes();

  const { createSubject, loading } = useCreateSubject();

  const {
    data: courseBuckets,
    totalPages: courseBucketsTotalPages,
    currentPage: courseBucketsPage,
    setCurrentPage: setCourseBucketsPage,
    loading: courseBucketsLoading,
  } = useFetchCourseBuckets({
    departmentId: department?.id,
    schoolId: school?.id,
    facultyId: faculty?.id,
    subjectTypeId: subjectType?.id,
    numberOfCourses: numberOfCoursesInABucket,
  });
  const {
    programs,
    totalPages: programsTotalPages,
    currentPage: programsCurrentPage,
    setCurrentPage: setProgramsCurrentPage,
  } = useFetchPrograms({
    departmentId: department?.id,
    facultyId: faculty?.id,
    schoolId: school?.id,
    programType: selectedProgramType ?? undefined,
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
      selectedCourses.map((course) => ({
        selectedCourse: course,
        seats: 0, // Default seat value
      })),
    );
  }, [selectedCourses]);

  useEffect(() => {
    setSelectedCourseBucketsWithSeats(
      selectedCourseBuckets.map((bucket) => ({
        selectedBucket: bucket,
        seats: 0, // Default seat value
      })),
    );
  }, [selectedCourseBuckets]);

  useEffect(() => {
    setSelectedPrograms([]);
  }, [department, faculty, school, subjectType]);

  const handleSubmit = async () => {
    setError(null); // Reset error before starting submission

    try {
      // Validate required fields
      if (!name) {
        setError("Subject name is required.");
        return;
      }
      if (!selectedBatch) {
        setError("Batch must be selected.");
        return;
      }
      if (!subjectType) {
        setError("Subject type is required.");
        return;
      }

      if (!subjectType.allotmentType) {
        setError("Allotment type is required.");
        return;
      }
      if (!selectedProgramType) {
        setError("Program type is required.");
        return;
      }
      if (selectedPrograms.length === 0) {
        setError("At least one program must be selected.");
        return;
      }
      if (
        selectedSemesters.length === 0 &&
        subjectType.allotmentType === "Bucket"
      ) {
        setError("At least one semester must be selected.");
        return;
      }
      if (!selectedSemester && subjectType.allotmentType === "Standalone") {
        setError("Semester must not be selected for standalone allotment.");
        return;
      }
      if (
        subjectType.allotmentType === "Standalone" &&
        (!selectedCoursesWithSeats || selectedCoursesWithSeats.length === 0)
      ) {
        setError("At least one course is required for standalone allotment.");
        return;
      }
      if (
        subjectType.allotmentType === "Bucket" &&
        (!selectedCourseBucketsWithSeats ||
          selectedCourseBucketsWithSeats.length === 0)
      ) {
        setError(
          "At least one course bucket is required for bucket-based allotment.",
        );
        return;
      }

      // Prepare request payload
      await createSubject({
        name: name,
        batchId: selectedBatch.id,
        subjectTypeId: subjectType.id,
        semesterIds: selectedSemesters.map((semester) => semester.id),
        semesterId: selectedSemester?.id || null,
        schoolId: school?.id || null,
        programType: selectedProgramType,
        departmentId: department?.id || null,
        facultyId: faculty?.id || null,
        programIds: selectedPrograms.map((program) => program.id),
        coursesWithSeats: selectedCoursesWithSeats.map(
          (course: CourseWithSeat) => ({
            courseId: course.selectedCourse.id,
            seats: course.seats,
          }),
        ),
        courseBucketsWithSeats: selectedCourseBucketsWithSeats.map(
          (bucket: CourseBucketWithSeat) => ({
            bucketId: bucket.selectedBucket.id,
            seats: bucket.seats,
          }),
        ),
        numberOfCoursesInABucket:
          subjectType.allotmentType === "Bucket"
            ? numberOfCoursesInABucket || null
            : undefined,
      });
      setName("");
      setSelectedBatch(null);
      setSubjectType(null);
      setSelectedProgramType(null);
      setNumberOfCoursesInABucket(undefined);
      setSchool(null);
      setSelectedPrograms([]);
      setSelectedCourses([]);
      setSelectedCourseBuckets([]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create subject",
      );
    }
  };

  const renderScopeSetter = () => {
    switch (subjectType?.scope) {
      case SubjectScope.SAME_DEPARTMENT:
        return (
          <SingleSelectMenu
            items={departments}
            label={"Department"}
            selected={department}
            setSelected={setDepartment}
          />
        );
      case SubjectScope.SAME_SCHOOL:
        return (
          <SingleSelectMenu
            label={"School"}
            items={schools}
            selected={school}
            setSelected={setSchool}
          />
        );
      case SubjectScope.SAME_FACULTY:
        return (
          <SingleSelectMenu
            label={"Faculty"}
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
        <PageHeader title="Create Subject" />
        
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the basic details about the subject.
            </p>
          </div>

          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <TextInputField
                value={name}
                setValue={setName}
                placeholder="Program Elective - V"
                label="Name"
              />
              <SingleSelectMenu
                items={subjectTypes}
                selected={subjectType}
                setSelected={setSubjectType}
                label="Subject type"
              />
              <SingleSelectMenu
                label="Batch"
                items={batches}
                prefix="Batch"
                selected={selectedBatch}
                setSelected={setSelectedBatch}
              />
              <SingleSelectEnumSelector
                label="Program Type"
                items={programTypes}
                selected={selectedProgramType}
                setSelected={setSelectedProgramType}
              />
              {subjectType?.allotmentType === AllotmentType.BUCKET && (
                <NumberInputField
                  maxValue={10}
                  minValue={0}
                  value={numberOfCoursesInABucket}
                  setValue={setNumberOfCoursesInABucket}
                  label="Number of Courses in a Bucket"
                />
              )}
              {renderScopeSetter()}
              {subjectType?.allotmentType === AllotmentType.STANDALONE && (
                <SingleSelectMenu
                  prefix="Semester"
                  items={semesters}
                  selected={selectedSemester}
                  setSelected={setSelectedSemester}
                  label="Semester"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Program Selection</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose the programs that will be associated with this subject.
            </p>
          </div>

          <div className="px-6 py-5">
            <ProgramsTable
              label="Choose programs"
              programs={programs}
              loading={programsLoading}
              showActionButtons={false}
              selectedPrograms={selectedPrograms}
              setSelectedPrograms={setSelectedPrograms}
              setCurrentPage={setProgramsCurrentPage}
              currentPage={programsCurrentPage}
              totalPages={programsTotalPages}
            />
          </div>
        </div>

        {subjectType?.allotmentType === "Standalone" && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Course Selection</h2>
              <p className="mt-1 text-sm text-gray-500">
                Select the courses that will be part of this subject.
              </p>
            </div>

            <div className="px-6 py-5">
              <CoursesTable
                courses={courses}
                totalPages={coursesTotalPages}
                currentPage={coursesCurrentPage}
                setCurrentPage={setCoursesCurrentPage}
                isLoading={coursesLoading}
                selectedCourses={selectedCourses}
                setSelectedCourses={setSelectedCourses}
                showActionButtons={false}
              />
            </div>
          </div>
        )}

        {subjectType?.allotmentType === "Bucket" && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Course Bucket Selection</h2>
              <p className="mt-1 text-sm text-gray-500">
                Select the course buckets and map them to semesters.
              </p>
            </div>

            <div className="px-6 py-5">
              <CourseBucketsTable
                buckets={courseBuckets}
                totalPages={courseBucketsTotalPages}
                currentPage={courseBucketsPage}
                setCurrentPage={setCourseBucketsPage}
                isLoading={courseBucketsLoading}
                selectedBuckets={selectedCourseBuckets}
                setSelectedBuckets={setSelectedCourseBuckets}
              />

              <div className="mt-8">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Course-Semester Mapping
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.no
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course no.
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {numberOfCoursesInABucket && numberOfCoursesInABucket > 0 ? (
                        Array.from({ length: numberOfCoursesInABucket }, (_, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              Course {index + 1}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              <SingleSelectMenuAlternate
                                items={semesters}
                                name="Semester"
                                selected={selectedSemesters[index] ?? null}
                                setSelected={(value: Semester | null) => {
                                  setSelectedSemesters((prevSemesters) => {
                                    const newSemesters = [...prevSemesters];
                                    newSemesters[index] = value!;
                                    return newSemesters;
                                  });
                                  return value;
                                }}
                                prefix="Semester"
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-4 text-center text-sm text-gray-500"
                          >
                            Number of courses in a bucket not selected yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {subjectType?.allotmentType === AllotmentType.BUCKET
                ? "Course Bucket"
                : "Course"}-Seat Mapping
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Assign seats to each {subjectType?.allotmentType === AllotmentType.BUCKET ? "course bucket" : "course"}.
            </p>
          </div>

          <div className="px-6 py-5">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {subjectType?.allotmentType === AllotmentType.BUCKET
                        ? "Course Bucket name"
                        : "Course name"}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjectType?.allotmentType === AllotmentType.STANDALONE &&
                  selectedCoursesWithSeats.length > 0 ? (
                    selectedCoursesWithSeats.map((courseWithSeat, index) => (
                      <tr key={courseWithSeat.selectedCourse.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {courseWithSeat.selectedCourse.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            className="w-24 text-center border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={courseWithSeat.seats}
                            onChange={(e) => {
                              const newSeats = parseInt(e.target.value, 10) || 0;
                              setSelectedCoursesWithSeats((prev) =>
                                prev.map((cws) =>
                                  cws.selectedCourse.id ===
                                  courseWithSeat.selectedCourse.id
                                    ? { ...cws, seats: newSeats }
                                    : cws,
                                ),
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : subjectType?.allotmentType === AllotmentType.BUCKET &&
                    selectedCourseBuckets.length > 0 ? (
                    selectedCourseBucketsWithSeats.map((bucket, index) => (
                      <tr key={bucket.selectedBucket.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {bucket.selectedBucket.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            className="w-24 text-center border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={bucket.seats || 0}
                            onChange={(e) => {
                              const newSeats = parseInt(e.target.value, 10) || 0;
                              setSelectedCourseBucketsWithSeats((prev) =>
                                prev.map((cws) =>
                                  cws.selectedBucket.id === bucket.selectedBucket.id
                                    ? { ...cws, seats: newSeats }
                                    : cws,
                                ),
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-center text-sm text-gray-500"
                      >
                        {`${subjectType?.allotmentType === AllotmentType.BUCKET ? "Course buckets" : "Courses"} not added yet`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            Create Subject
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
