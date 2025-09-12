import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import { useParams } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import useFetchFaculties, {
  Faculty,
} from "../../hooks/facultyHooks/useFetchFaculties.ts";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";
import useFetchSchoolById from "../../hooks/schoolHooks/useFetchSchoolById.ts";
import useUpdateSchool from "../../hooks/schoolHooks/useUpdateSchool.ts";

export default function ViewSchoolPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: school,
    loading: schoolLoading,
    error: schoolError,
  } = useFetchSchoolById(id!);
  const {
    updateSchool,
    loading: updateLoading,
    error: updateError,
  } = useUpdateSchool();
  const { faculties } = useFetchFaculties();
  const { notify } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [faculty, setFaculty] = useState<Faculty | null>(null);

  useEffect(() => {
    if (school) {
      setSchoolName(school.name);
      setFaculty(school.faculty);
    }
  }, [school]);

  const handleSubmit = async () => {
    if (!schoolName || !faculty) {
      notify("error", "Please fill in all required fields.");
      return;
    }

    const schoolData = {
      name: schoolName,
      facultyId: faculty.id,
    };

    const response = updateSchool(id!, schoolData);
    notify("promise", "School updated successfully", response);
    setIsEditing(false);
  };

  if (schoolLoading) {
    return (
      <MainLayout>
        <div className="py-8">
          <PageHeader title="Loading..." />
          <div className="bg-white shadow-md rounded-lg p-8 mt-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title="View School" />
        <div className="bg-white shadow-md rounded-lg p-8 mt-8">
          <div className="grid grid-cols-2 gap-x-32 gap-y-12">
            {isEditing ? (
              <>
                <TextInputField
                  value={schoolName}
                  setValue={setSchoolName}
                  label="School name"
                />
                <SingleSelectMenu
                  items={faculties}
                  selected={faculty}
                  setSelected={setFaculty}
                  label="Faculty"
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    School name
                  </label>
                  <p className="p-2 border rounded text-sm">{schoolName}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Faculty
                  </label>
                  <p className="p-2 border rounded text-sm">{faculty?.name}</p>
                </div>
              </>
            )}
          </div>
          {(schoolError || updateError) && (
            <p className="text-red-500 mt-4">{schoolError || updateError}</p>
          )}
          {isEditing ? (
            <button
              onClick={handleSubmit}
              disabled={schoolLoading || updateLoading}
              className={`bg-blue-500 w-full p-2 rounded-lg hover:bg-blue-400 mt-12 text-white ${
                schoolLoading || updateLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {schoolLoading || updateLoading ? "Updating..." : "Update"}
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