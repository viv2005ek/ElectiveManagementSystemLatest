import MainLayout from "../layouts/MainLayout.tsx";
import { useStudentAllotments } from "../hooks/subjectHooks/useStudentAllotments.ts";

export default function ViewStudentsAllotmentsPage() {
  const { allotments, loading, error } = useStudentAllotments();
  return (
    <MainLayout>
      <div className={"mt-8"}></div>
    </MainLayout>
  );
}
