import MainLayout from "../../layouts/MainLayout.tsx";
import UpcomingDeadlinesList from "../../components/UpcomingDeadlinesList.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import useFetchActiveSubjects from "../../hooks/subjectHooks/useFetchActiveSubjects.ts";

export default function ActiveSubjectsPage() {
  const { subjects, loading, error } = useFetchActiveSubjects();
  
  return (
    <MainLayout>
      <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <PageHeader title={"Active subject allotments"} />
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <UpcomingDeadlinesList subjects={subjects} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
}