import { useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import NumberInputField from "../../components/FormComponents/NumberInputField.tsx";
import useFetchDepartments, {
  Department,
} from "../../hooks/departmentHooks/useFetchDepartments.ts";
import SingleSelectMenuWithSearch from "../../components/FormComponents/SingleSelectMenuWithSearch.tsx";
import useCreateCourse from "../../hooks/courseHooks/useCreateCourse.ts";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import useFetchSubjectTypes, {
  SubjectType,
} from "../../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import MultiSelectMenu from "../../components/FormComponents/MultiSelectMenu.tsx";
import useFetchSemesters, {
  Semester,
} from "../../hooks/semesterHooks/useFetchSemesters.ts";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";

export default function CreateCoursePage() {
  const { departments } = useFetchDepartments();
  const { createCourse, loading, error } = useCreateCourse();
  const { subjectTypes } = useFetchSubjectTypes();
  const { notify } = useNotification();
  const { semesters } = useFetchSemesters();

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credits, setCredits] = useState<number | undefined>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [selectedSubjectTypes, setSelectedSubjectTypes] = useState<
    SubjectType[]
  >([]);
  const [semester, setSemester] = useState<Semester | null>(null);

  const handleSubmit = async () => {
    if (!courseName || !courseCode || !credits || !department) {
      alert("Please fill in all required fields.");
      return;
    }

    const courseData = {
      name: courseName,
      code: courseCode,
      credits,
      departmentId: department.id,
      subjectTypeIds: selectedSubjectTypes.map((subjectType) => subjectType.id),
      semesterId: semester?.id,
    };

    const response = await createCourse(courseData);

    if (response) {
      setCourseCode("");
      setCourseName("");
      setCredits(undefined);
      setDepartment(null);
      setSelectedSubjectTypes([]);
      setSemester(null);
    }
  };

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title="Create Course" />
        <div className="grid grid-cols-2 gap-x-32 gap-y-12 mt-8">
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
            label={"Subject Types"}
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
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-blue-400 w-full p-2 rounded-lg hover:bg-blue-300 mt-12 text-white ${loading && "opacity-50 cursor-not-allowed"}`}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </MainLayout>
  );
}
