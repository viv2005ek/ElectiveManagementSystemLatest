import MainLayout from "../layouts/MainLayout.tsx";
import OpenElectivesList from "../components/OpenElectivesList.tsx";

export default function ElectiveChoicePage() {
  return (
    <MainLayout>
      <div className={"py-8 px-16"}>
        <OpenElectivesList />
      </div>
    </MainLayout>
  );
}
