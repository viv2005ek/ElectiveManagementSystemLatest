import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import StudentsLandingPage from "./pages/StudentsLandingPage.tsx";
import ElectiveChoicePage from "./pages/ElectiveChoicePage.tsx";
import ProgrammeElectivesPage from "./pages/ProgrammeElectivesPage.tsx";
import AllStudentList from "./pages/AllStudentListPage.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import MinorSpecializationsPage from "./pages/MinorSpecializationsPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import ElectiveManagementSystem from "./pages/ElectiveManagementSystemPage.tsx";
import OpenElective from "./pages/OpenelectivePage.tsx";
import ManageOEPage from "./pages/ManageOEPage.tsx";
import EMSAdmin from "./pages/EMSAdminPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import CreateSubjectPage from './pages/CreateSubjectPage.tsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<StudentsLandingPage />} />
        <Route path="/choose/:id" element={<ElectiveChoicePage />} />
        <Route
          path="/programme-electives"
          element={<ProgrammeElectivesPage />}
        />
        <Route
          path="/minor-specializations"
          element={<MinorSpecializationsPage />}
        />
        <Route path="/student-list" element={<AllStudentList />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/ems" element={<ElectiveManagementSystem />} />
        <Route path="/oe" element={<OpenElective />} />
        <Route path="/oemanage" element={<ManageOEPage />} />
        <Route path="/emsadmin" element={<EMSAdmin />} />
        <Route path={"/*"} element={<NotFoundPage />} />
        <Route path={'/subjects/create'} element={<CreateSubjectPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
