import MainLayout from '../layouts/MainLayout.tsx';
import UpcomingDeadlinesList from '../components/UpcomingDeadlinesList.tsx';

export default function StudentsLandingPage () {
  return (
    <MainLayout>
      <div className={'px-16 py-8'}>
        <div className={'font-semibold text-xl mb-4 underline'}>Ongoing events</div>
        <UpcomingDeadlinesList/>
      </div>
    </MainLayout>
  )
}
