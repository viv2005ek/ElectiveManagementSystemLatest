import MainLayout from "../layouts/MainLayout.tsx";
import Admin from "../components/Admin.tsx";

export default function ElectiveChoicePage() {
  return (
    <MainLayout>
      <div className={"py-8 px-16"}>
        <Admin />
      </div>
    </MainLayout>
  );
}
