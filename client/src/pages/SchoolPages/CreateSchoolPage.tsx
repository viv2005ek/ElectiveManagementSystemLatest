import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import TextInputField from "../../components/FormComponents/TextInputField.tsx";
import { useState } from "react";
import SingleSelectMenu from "../../components/FormComponents/SingleSelectMenu.tsx";
import useFetchFaculties, {
  Faculty,
} from "../../hooks/facultyHooks/useFetchFaculties.ts";
import useCreateSchool from "../../hooks/schoolHooks/useCreateSchool.ts";

export default function CreateSchoolPage() {
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const { faculties } = useFetchFaculties();
  const { createSchool, loading } = useCreateSchool();

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("School name is required");
      return;
    }

    if (!faculty) {
      alert("Please select a faculty");
      return;
    }

    await createSchool(name, faculty.id);
    setName("");
    setFaculty(null);
  };

  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Create School"} />
        <div className={"mt-16 grid grid-cols-2 gap-32"}>
          <TextInputField value={name} setValue={setName} label={"Name"} />
          <SingleSelectMenu
            items={faculties}
            selected={faculty}
            setSelected={setFaculty}
            label={"Faculty"}
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
