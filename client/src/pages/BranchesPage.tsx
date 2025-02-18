import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import useBranches from "../hooks/useBranches.ts";
import { useState } from "react";
import { Department } from "../hooks/useDepartments.ts";
import BranchesTable from "../components/tables/BranchesTable.tsx";

export default function BranchesPage() {
  const [department, setDepartment] = useState<Department | null>(null);

  const { branches } = useBranches(true, department);

  return (
    <MainLayout>
      <div className={"p-8"}>
        <PageHeader title={"Branches"} />
        <BranchesTable branches={branches} />
      </div>
    </MainLayout>
  );
}
