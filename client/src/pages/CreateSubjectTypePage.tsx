import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import { useState } from "react";
import TextAreaInputField from "../components/FormComponents/TextAreaInputField.tsx";
import useFetchAllotmentTypes from "../hooks/enumHooks/useFetchAllotmentTypes.ts";
import SingleSelectEnumSelector from "../components/FormComponents/SingleSelectEnumSelector.tsx";
import useFetchSubjectScopes from "../hooks/enumHooks/useFetchSubjectScopes.ts";
import useCreateSubjectType from "../hooks/subjectTypeHooks/useCreateSubjectType.ts";

export default function CreateSubjectTypePage() {
  const { allotmentTypes } = useFetchAllotmentTypes();
  const { scopes } = useFetchSubjectScopes();
  const { createSubjectType, loading, error, success } = useCreateSubjectType();

  const [subjectTypeName, setSubjectTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [allotmentType, setAllotmentType] = useState<string | null>(null);
  const [scope, setScope] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!subjectTypeName || !allotmentType || !scope) {
      alert("Please fill in all required fields.");
      return;
    }

    await createSubjectType({
      name: subjectTypeName,
      description,
      allotmentType,
      scope,
    });

    if (success) {
      setSubjectTypeName("");
      setDescription("");
      setAllotmentType(null);
      setScope(null);
    }
  };

  return (
    <MainLayout>
      <div className={"py-8"}>
        <PageHeader title={"Create Subject Type"} />
        <div
          className={"grid md:grid-cols-2 grid-cols-1 gap-x-32 gap-y-12 mt-8"}
        >
          <TextInputField
            placeholder={"Flexi core"}
            value={subjectTypeName}
            setValue={setSubjectTypeName}
            label={"Subject Type name"}
          />
          <div className={"row-span-2 pb-8"}>
            <TextAreaInputField
              placeholder={
                "Allows students to choose and learn a core engineering concept in a flexible mode."
              }
              value={description}
              setValue={setDescription}
              label={"Description"}
            />
          </div>
          <SingleSelectEnumSelector
            items={allotmentTypes}
            selected={allotmentType}
            setSelected={setAllotmentType}
            label={"Allotment type"}
          />
          <SingleSelectEnumSelector
            items={scopes}
            selected={scope}
            setSelected={setScope}
            label={"Subject scope"}
            info={"Define the scope within which students can select courses."}
          />
        </div>
        <button
          onClick={handleSubmit}
          className={
            "bg-blue-400 w-full p-2 rounded-lg hover:bg-blue-300 mt-12 text-white"
          }
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </MainLayout>
  );
}
