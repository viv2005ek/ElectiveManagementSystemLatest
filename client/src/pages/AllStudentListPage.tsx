import MainLayout from '../layouts/MainLayout.tsx';
import AllStudentList from '../components/AllStudentList.tsx';

export default function AllStudentListPage() {
  return (
    <MainLayout>
      <div className={"py-16 px-8"}>
        <AllStudentList />
      </div>
    </MainLayout>
  );
}
