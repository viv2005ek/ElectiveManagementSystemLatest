import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import {useState} from "react";
import SingleSelectMenu from "../components/FormComponents/SingleSelectMenu.tsx";
import useFetchSchools, {School,} from "../hooks/schoolHooks/useFetchSchools.ts";
import useCreateDepartment from "../hooks/departmentHooks/useCreateDepartment.ts";

export default function CreateDepartmentPage() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState<School | null>(null);
  const { schools } = useFetchSchools();
  const { createDepartment, loading } = useCreateDepartment();

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Department name is required");
      return;
    }

    if (!school) {
      alert("Please select a school");
      return;
    }

    await createDepartment(name, school.id);
    setName("");
    setSchool(null);
  };

  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Create Department"} />
        <div className={"mt-16 grid grid-cols-2 gap-32"}>
          <TextInputField value={name} setValue={setName} label={"Name"} />
          <SingleSelectMenu
            items={schools}
            selected={school}
            setSelected={setSchool}
            label={"School"}
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
