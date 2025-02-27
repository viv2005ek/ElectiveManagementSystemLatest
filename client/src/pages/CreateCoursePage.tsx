import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import { useState } from "react";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import NumberInputField from "../components/FormComponents/NumberInputField.tsx";
import MultiSelectMenuWithSearch from "../components/FormComponents/MultiSelectMenuWithSearch.tsx";
import useFetchDepartments, {
  Department,
} from "../hooks/departmentHooks/useFetchDepartments.ts";
import SingleSelectMenu from "../components/FormComponents/SingleSelectMenu.tsx";
import SingleSelectMenuWithSearch from "../components/FormComponents/SingleSelectMenuWithSearch.tsx";

export default function CreateCoursePage() {
  const { departments } = useFetchDepartments();

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credits, setCredits] = useState<number | undefined>();
  const [department, setDepartment] = useState<Department | null>(null);
  return (
    <MainLayout>
      <div className={"py-8"}>
        <PageHeader title={"Create Course"} />
        <div className={"grid grid-cols-2 gap-x-32 gap-y-12 mt-8"}>
          <TextInputField
            value={courseName}
            setValue={setCourseName}
            label={"Course name"}
          />
          <TextInputField
            value={courseCode}
            setValue={setCourseCode}
            label={"Course code"}
          />
          <NumberInputField
            value={credits}
            setValue={setCredits}
            label={"Credits"}
          />
          <SingleSelectMenuWithSearch
            items={departments}
            selected={department}
            setSelected={setDepartment}
            label={"Department"}
          />
        </div>
        <button
          className={
            "bg-blue-400 w-full p-2 rounded-lg hover:bg-blue-300 mt-12 text-white"
          }
        >
          Create
        </button>
      </div>
    </MainLayout>
  );
}
