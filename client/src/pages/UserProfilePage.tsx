import MainLayout from "../layouts/MainLayout.tsx";
import UserProfile from "../components/UserProfile.tsx";

export default function UserProfilePage() {
  return (
    <MainLayout>
      <div className={"py-16 px-8"}>
        <UserProfile />
      </div>
    </MainLayout>
  );
}
