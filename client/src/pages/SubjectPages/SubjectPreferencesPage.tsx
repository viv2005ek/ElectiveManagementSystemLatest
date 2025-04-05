import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams } from "react-router-dom";
import useFetchSubjectPreferences from "../../hooks/subjectPreferenceHooks/useFetchSubjectPreferences.ts";

export default function SubjectPreferencesPage() {
  const { id } = useParams<{ id: string }>();

  const { subjectPreferences } = useFetchSubjectPreferences(id);

  return (
    <MainLayout>
      <div className={"mt-8"}>
        <PageHeader title={"Preferences filled by students"} />
        <div></div>
      </div>
    </MainLayout>
  );
}
