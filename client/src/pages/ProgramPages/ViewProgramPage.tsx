import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import { useParams } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext.tsx";
import useFetchDepartments, {
  Department,
} from "../../hooks/departmentHooks/useFetchDepartments.ts";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";
import useFetchProgramById from "../../hooks/programHooks/useFetchProgramById.ts";
import useUpdateProgram from "../../hooks/programHooks/useUpdateProgram.ts";
import useFetchProgramTypes from "../../hooks/programHooks/useFetchProgramTypes.ts";
import SingleSelectEnumSelector from "../../components/FormComponents/SingleSelectEnumSelector.tsx";
import { ProgramType } from "../../hooks/programHooks/useFetchPrograms.ts";

export default function ViewProgramPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: program,
    loading: programLoading,
    error: programError,
  } = useFetchProgramById(id!);
  const {
    updateProgram,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProgram();
  const { departments } = useFetchDepartments();
  const { programTypes } = useFetchProgramTypes();
  const { notify } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [programName, setProgramName] = useState("");
  const [department, setDepartment] = useState<Department | null>(null);
  const [programType, setProgramType] = useState<ProgramType | null>(null);

  useEffect(() => {
    if (program) {
      setProgramName(program.name);
     setDepartment(program.department as Department);
      setProgramType(program.programType);
    }
  }, [program]);

  const handleSubmit = async () => {
    if (!programName || !department || !programType) {
      notify("error", "Please fill in all required fields.");
      return;
    }

    const programData = {
      name: programName,
      departmentId: department.id,
      programType: programType,
    };

    const response = updateProgram(id!, programData);
    notify("promise", "Program updated successfully", response);
    setIsEditing(false);
  };

  if (programLoading) {
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
        <PageHeader title="View Program" />
        <div className="bg-white shadow-md rounded-lg p-8 mt-8">
          <div className="grid grid-cols-2 gap-x-32 gap-y-12">
            {isEditing ? (
              <>
                <TextInputField
                  value={programName}
                  setValue={setProgramName}
                  label="Program name"
                />
                <SingleSelectMenu
                  items={departments}
                  selected={department}
                  setSelected={setDepartment}
                  label="Department"
                />
                <SingleSelectEnumSelector
                  items={programTypes}
                  selected={programType}
                  setSelected={setProgramType}
                  label="Program Type"
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Program name
                  </label>
                  <p className="p-2 border rounded text-sm">{programName}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Department
                  </label>
                  <p className="p-2 border rounded text-sm">{department?.name}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Program Type
                  </label>
                  <p className="p-2 border rounded text-sm">{programType}</p>
                </div>
              </>
            )}
          </div>
          {(programError || updateError) && (
            <p className="text-red-500 mt-4">{programError || updateError}</p>
          )}
          {isEditing ? (
            <button
              onClick={handleSubmit}
              disabled={programLoading || updateLoading}
              className={`bg-blue-500 w-full p-2 rounded-lg hover:bg-blue-400 mt-12 text-white ${
                programLoading || updateLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {programLoading || updateLoading ? "Updating..." : "Update"}
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