import MainLayout from "../layouts/MainLayout.tsx";
import MinorSpecializationsList from "../components/MinorSpecializationsList.tsx";

export default function MinorSpecializationsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <MainLayout>
      <div className={"p-8"}>
        <MinorSpecializationsList />
      </div>
    </MainLayout>
  );
}
