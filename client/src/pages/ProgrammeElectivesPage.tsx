import MainLayout from "../layouts/MainLayout.tsx";
import { PreferenceSelection } from "../components/preference-selection.tsx";
import img from "../assets/back.png";

export default function ProgrammeElectivesPage() {
  return (
    <MainLayout>
      <div
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        <div className="max-w-5xl mx-auto py-10 px-4">
          <PreferenceSelection />
        </div>
      </div>
    </MainLayout>
  );
}
