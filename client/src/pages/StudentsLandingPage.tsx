import MainLayout from '../layouts/MainLayout.tsx';
import UpcomingDeadlinesList from '../components/UpcomingDeadlinesList.tsx';
import PageHeader from '../components/PageHeader.tsx';

export default function StudentsLandingPage() {
  return (
    <MainLayout>
      <div className={"px-16 py-8"}>
        <PageHeader title={"Active subject allotments"} />
        <div className={"mt-8"}>
          <UpcomingDeadlinesList />
        </div>
      </div>
    </MainLayout>
  );
}
