import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import {useState} from "react";
import useCreateFaculty from "../hooks/facultyHooks/useCreateFaculty.ts";
import {useNotification} from "../contexts/NotificationContext.tsx";

export default function CreateFacultyPage() {
  const { notify } = useNotification();
  const [name, setName] = useState("");
  const { createFaculty, loading, error } = useCreateFaculty();

  async function handleSubmit() {
    if (!name.trim()) return alert("Faculty name is required!");

    const result = await createFaculty(name);
    if (result) {
      setName("");
    }
  }

  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Create Faculty"} />
        <div className={"mt-8 flex flex-col gap-8"}>
          <TextInputField label={"Name"} value={name} setValue={setName} />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full p-2 rounded-lg text-white text-md ${
              loading ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </MainLayout>
  );
}
