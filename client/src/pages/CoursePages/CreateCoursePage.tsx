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
      notify("error", "Please fill in all required fields.");
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
      notify("success", "Course created successfully!");
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="Create Course" />
        
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Course Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details to create a new course.
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextInputField
                  value={courseName}
                  setValue={setCourseName}
                  label="Course name"
                />
              </div>
              <div>
                <TextInputField
                  value={courseCode}
                  setValue={setCourseCode}
                  label="Course code"
                />
              </div>
              <div>
                <NumberInputField
                  value={credits}
                  setValue={setCredits}
                  label="Credits"
                />
              </div>
              <div>
                <SingleSelectMenuWithSearch
                  items={departments}
                  selected={department}
                  setSelected={setDepartment}
                  label="Department"
                />
              </div>
              <div>
                <MultiSelectMenu
                  label="Subject Types"
                  items={subjectTypes}
                  selected={selectedSubjectTypes}
                  setSelected={setSelectedSubjectTypes}
                />
              </div>
              <div>
                <SingleSelectMenu
                  label="Semester"
                  prefix="Semester"
                  items={semesters}
                  selected={semester}
                  setSelected={setSemester}
                />
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
