import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import { useParams } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import useFetchSchools, {
  School,
} from "../../hooks/schoolHooks/useFetchSchools.ts";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";
import useFetchDepartmentById from "../../hooks/departmentHooks/useFetchDepartmentById.ts";
import useUpdateDepartment from "../../hooks/departmentHooks/useUpdateDepartment.ts";

export default function ViewDepartmentPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: department,
    loading: departmentLoading,
    error: departmentError,
  } = useFetchDepartmentById(id!);
  const {
    updateDepartment,
    loading: updateLoading,
    error: updateError,
  } = useUpdateDepartment();
  const { schools } = useFetchSchools();
  const { notify } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [school, setSchool] = useState<School | null>(null);

  useEffect(() => {
    if (department) {
      setDepartmentName(department.name);
      setSchool(department.school);
    }
  }, [department]);

  const handleSubmit = async () => {
    if (!departmentName || !school) {
      notify("error", "Please fill in all required fields.");
      return;
    }

    const departmentData = {
      name: departmentName,
      schoolId: school.id,
    };

    const response = updateDepartment(id!, departmentData);
    notify("promise", "Department updated successfully", response);
    setIsEditing(false);
  };

  if (departmentLoading) {
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
        <PageHeader title="View Department" />
        <div className="bg-white shadow-md rounded-lg p-8 mt-8">
          <div className="grid grid-cols-2 gap-x-32 gap-y-12">
            {isEditing ? (
              <>
                <TextInputField
                  value={departmentName}
                  setValue={setDepartmentName}
                  label="Department name"
                />
                <SingleSelectMenu
                  items={schools}
                  selected={school}
                  setSelected={setSchool}
                  label="School"
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Department name
                  </label>
                  <p className="p-2 border rounded text-sm">{departmentName}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    School
                  </label>
                  <p className="p-2 border rounded text-sm">{school?.name}</p>
                </div>
              </>
            )}
          </div>
          {(departmentError || updateError) && (
            <p className="text-red-500 mt-4">{departmentError || updateError}</p>
          )}
          {isEditing ? (
            <button
              onClick={handleSubmit}
              disabled={departmentLoading || updateLoading}
              className={`bg-blue-500 w-full p-2 rounded-lg hover:bg-blue-400 mt-12 text-white ${
                departmentLoading || updateLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {departmentLoading || updateLoading ? "Updating..." : "Update"}
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