import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import { useDepartments } from "../hooks/useDepartments.ts";
import DepartmentsTable from "../components/tables/DepartmentsTable.tsx";

export default function DepartmentsPage() {
  const { departments, isLoading } = useDepartments();

  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Departments"} />
        <DepartmentsTable loading={isLoading} departments={departments} />
      </div>
    </MainLayout>
  );
}
