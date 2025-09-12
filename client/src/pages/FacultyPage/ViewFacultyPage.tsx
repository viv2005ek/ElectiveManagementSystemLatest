import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import { useParams } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import useFetchFacultyById from "../../hooks/facultyHooks/useFetchFacultyById.ts";
import useUpdateFaculty from "../../hooks/facultyHooks/useUpdateFaculty.ts";

export default function ViewFacultyPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: faculty,
    loading: facultyLoading,
    error: facultyError,
  } = useFetchFacultyById(id!);
  const {
    updateFaculty,
    loading: updateLoading,
    error: updateError,
  } = useUpdateFaculty();
  const { notify } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [facultyName, setFacultyName] = useState("");

  useEffect(() => {
    if (faculty) {
      setFacultyName(faculty.name);
    }
  }, [faculty]);

  const handleSubmit = async () => {
    if (!facultyName) {
      notify("error", "Please fill in all required fields.");
      return;
    }

    const facultyData = {
      name: facultyName,
    };

    const response = updateFaculty(id!, facultyData);
    notify("promise", "Faculty updated successfully", response);
    setIsEditing(false);
  };

  if (facultyLoading) {
    return (
      <MainLayout>
        <div className="py-8">
          <PageHeader title="Loading..." />
          <div className="bg-white shadow-md rounded-lg p-8 mt-8">
            <div className="animate-pulse space-y-4">
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
        <PageHeader title="View Faculty" />
        <div className="bg-white shadow-md rounded-lg p-8 mt-8">
          <div className="grid grid-cols-1 gap-y-12">
            {isEditing ? (
              <TextInputField
                value={facultyName}
                setValue={setFacultyName}
                label="Faculty name"
              />
            ) : (
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Faculty name
                </label>
                <p className="p-2 border rounded text-sm">{facultyName}</p>
              </div>
            )}
          </div>
          {(facultyError || updateError) && (
            <p className="text-red-500 mt-4">{facultyError || updateError}</p>
          )}
          {isEditing ? (
            <button
              onClick={handleSubmit}
              disabled={facultyLoading || updateLoading}
              className={`bg-blue-500 w-full p-2 rounded-lg hover:bg-blue-400 mt-12 text-white ${
                facultyLoading || updateLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {facultyLoading || updateLoading ? "Updating..." : "Update"}
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