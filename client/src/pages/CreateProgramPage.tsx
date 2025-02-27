import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import { useState } from "react";
import SingleSelectMenu from "../components/FormComponents/SingleSelectMenu.tsx";
import useFetchDepartments, {
  Department,
} from "../hooks/departmentHooks/useFetchDepartments.ts";
import useCreateProgram from "../hooks/programHooks/useCreateProgram.ts";
import useFetchProgramTypes from "../hooks/programHooks/useFetchProgramTypes.ts";
import SingleSelectEnumSelector from "../components/FormComponents/SingleSelectEnumSelector.tsx";

export default function CreateProgramPage() {
  const [name, setName] = useState("");
  const [programType, setProgramType] = useState<string | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const { createProgram, loading } = useCreateProgram();
  const { departments } = useFetchDepartments();
  const { programTypes } = useFetchProgramTypes();

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Department name is required");
      return;
    }
    if (!programType) {
      alert("Program type is required");
      return;
    }
    if (!department) {
      alert("Department ID is required");
      return;
    }

    await createProgram({ name, departmentId: department.id, programType });
    setName("");
    setDepartment(null);
    setProgramType(null);
  };

  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Create Department"} />
        <div className={"mt-16 grid grid-cols-2 gap-x-32 gap-y-16"}>
          <TextInputField value={name} setValue={setName} label={"Name"} />
          <SingleSelectMenu
            items={departments}
            selected={department}
            setSelected={setDepartment}
            label={"Department"}
          />
          <SingleSelectEnumSelector
            label={"Program type"}
            items={programTypes}
            selected={programType}
            setSelected={setProgramType}
          />
        </div>
        <button
          className={
            "w-full bg-blue-500 p-2 rounded-lg text-white text-md mt-16"
          }
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </MainLayout>
  );
}
