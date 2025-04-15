import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import NumberInputField from "../../components/FormComponents/NumberInputField.tsx";
import useFetchDepartments, {
  Department,
} from "../../hooks/departmentHooks/useFetchDepartments.ts";
import SingleSelectMenuWithSearch from "../../components/FormComponents/SingleSelectMenuWithSearch.tsx";
import MultiSelectMenu from "../../components/FormComponents/MultiSelectMenu.tsx";
import useFetchSubjectTypes, {
  SubjectType,
} from "../../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import useFetchCourse from "../../hooks/courseHooks/useFetchCourse.ts";
import useUpdateCourse from "../../hooks/courseHooks/useUpdateCourse.ts";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import { useParams } from "react-router-dom";
import useFetchSemesters, {
  Semester,
} from "../../hooks/semesterHooks/useFetchSemesters.ts";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";

export default function ViewCoursePage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: course,
    loading: courseLoading,
    error: courseError,
  } = useFetchCourse(id!);
  const {
    updateCourse,
    loading: updateLoading,
    error: updateError,
  } = useUpdateCourse();
  const { departments } = useFetchDepartments();
  const { subjectTypes } = useFetchSubjectTypes();
  const { notify } = useNotification();
  const { semesters } = useFetchSemesters();

  const [isEditing, setIsEditing] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credits, setCredits] = useState<number | undefined>(undefined);
  const [department, setDepartment] = useState<Department | null>(null);
  const [selectedSubjectTypes, setSelectedSubjectTypes] = useState<
    SubjectType[]
  >([]);
  const [semester, setSemester] = useState<Semester | null>(null);

  useEffect(() => {
    if (course) {
      setCourseName(course.name);
      setCourseCode(course.code);
      setCredits(course.credits);
      setDepartment(course.department);
      setSelectedSubjectTypes(course.subjectTypes);
      setSemester(course.semester);
    }
  }, [course]);

  const handleSubmit = async () => {
    if (!courseName || !courseCode || !credits || !department || !semester) {
      alert("Please fill in all required fields.");
      return;
    }

    const courseData = {
      name: courseName,
      code: courseCode,
      credits,
      departmentId: department.id,
      subjectTypeIds: selectedSubjectTypes.map((subjectType) => subjectType.id),
      semesterId: semester.id,
    };

    const response = updateCourse(id!, courseData);
    notify("promise", "Course updated successfully", response);
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title="View Course" />
        <div className="bg-white shadow-md rounded-lg p-8 mt-8">
          <div className="grid grid-cols-2 gap-x-32 gap-y-12">
            {isEditing ? (
              <>
                <TextInputField
                  value={courseName}
                  setValue={setCourseName}
                  label="Course name"
                />
                <TextInputField
                  value={courseCode}
                  setValue={setCourseCode}
                  label="Course code"
                />
                <NumberInputField
                  value={credits}
                  setValue={setCredits}
                  label="Credits"
                />
                <SingleSelectMenuWithSearch
                  items={departments}
                  selected={department}
                  setSelected={setDepartment}
                  label="Department"
                />
                <MultiSelectMenu
                  label="Subject Types"
                  items={subjectTypes}
                  selected={selectedSubjectTypes}
                  setSelected={setSelectedSubjectTypes}
                />
                <SingleSelectMenu
                  label={"Semester"}
                  prefix={"Semester"}
                  items={semesters}
                  selected={semester}
                  setSelected={setSemester}
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Course name
                  </label>
                  <p className="p-2 border rounded text-sm">{courseName}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Course code
                  </label>
                  <p className="p-2 border rounded text-sm">{courseCode}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Credits
                  </label>
                  <p className="p-2 border rounded text-sm">{credits}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Department
                  </label>
                  <p className="p-2 border rounded text-sm">
                    {department?.name}
                  </p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Subject Types
                  </label>
                  {selectedSubjectTypes.length === 0 ? (
                    <p className="text-gray-400 text-sm font-semibold ">
                      No subject types added
                    </p>
                  ) : (
                    <p className="p-2 border text-sm rounded">
                      {selectedSubjectTypes.map((st) => st.name).join(", ")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Semester
                  </label>
                  <p className="p-2 border rounded text-sm">
                    {semester?.number}
                  </p>
                </div>
              </>
            )}
          </div>
          {(courseError || updateError) && (
            <p className="text-red-500 mt-4">{courseError || updateError}</p>
          )}
          {isEditing ? (
            <button
              onClick={handleSubmit}
              disabled={courseLoading || updateLoading}
              className={`bg-blue-500 w-full p-2 rounded-lg hover:bg-blue-400 mt-12 text-white ${courseLoading || updateLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {courseLoading || updateLoading ? "Updating..." : "Update"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 w-full p-2 rounded-lg hover:bg-blue-400 mt-12 text-white"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
