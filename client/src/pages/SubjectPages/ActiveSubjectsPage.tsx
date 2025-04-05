import MainLayout from "../../layouts/MainLayout.tsx";
import UpcomingDeadlinesList from "../../components/UpcomingDeadlinesList.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import useFetchActiveSubjects from "../../hooks/subjectHooks/useFetchActiveSubjects.ts";

export default function ActiveSubjectsPage() {
  const { subjects, loading, error } = useFetchActiveSubjects();
  return (
    <MainLayout>
      <div className={"py-8"}>
        <PageHeader title={"Active subject allotments"} />
        <div className={"mt-8"}>
          <UpcomingDeadlinesList subjects={subjects} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
}
