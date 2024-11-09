import MainLayout from '../layouts/MainLayout.tsx';
import OpenElectivesTable from '../components/OpenElectivesTable.tsx';

export default function OpenElectivesPage () {
  return (
    <MainLayout>
      <div className={'py-16 px-8'}>
        <OpenElectivesTable/>
      </div>
    </MainLayout>
  )
}
