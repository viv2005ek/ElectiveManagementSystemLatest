import MainLayout from '../layouts/MainLayout.tsx';
import MinorSpecializationsList from '../components/MinorSpecializationsList.tsx';
import { useMinorSpecializations } from '../hooks/useMinorSpecializations.ts';

export default function MinorSpecializationsPage () {

  const {minorSpecializations, isLoading, error} = useMinorSpecializations()

  return (
    <MainLayout>
      <div className={'p-8'}>
        <MinorSpecializationsList list={minorSpecializations}/>
      </div>
    </MainLayout>
  )
}
