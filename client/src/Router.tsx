import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import StudentsLandingPage from "./pages/StudentsLandingPage.tsx";
import ElectiveChoicePage from "./pages/ElectiveChoicePage.tsx";
import AllStudentList from "./pages/AllStudentListPage.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import MinorSpecializationsPage from "./pages/MinorSpecializationsPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import ElectiveManagementSystem from "./pages/ElectiveManagementSystemPage.tsx";
import OpenElective from "./pages/OpenelectivePage.tsx";
import ManageOEPage from "./pages/ManageOEPage.tsx";
import EMSAdmin from "./pages/EMSAdminPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import DepartmentsPage from "./pages/DepartmentsPage.tsx";
import StudentsPage from "./pages/StudentsPage.tsx";
import CoursesPage from "./pages/CoursesPage.tsx";
import CreateFacultyPage from "./pages/CreateFacultyPage.tsx";
import FacultiesPage from "./pages/FacultiesPage.tsx";
import CreateSchoolPage from "./pages/CreateSchoolPage.tsx";
import SchoolsPage from "./pages/SchoolsPage.tsx";
import CreateDepartmentPage from "./pages/CreateDepartmentPage.tsx";
import CreateProgramPage from "./pages/CreateProgramPage.tsx";
import ProgramsPage from "./pages/ProgramsPage.tsx";
import CreateSubjectPage from "./pages/CreateSubjectPage.tsx";
import CreateCoursePage from "./pages/CreateCoursePage.tsx";
import CreateSubjectTypePage from "./pages/CreateSubjectTypePage.tsx";
import SubjectsPage from "./pages/SubjectPage.tsx";
import SubjectReference from "./pages/SubjectPreference.tsx";
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<StudentsLandingPage />} />
        <Route path="/choose/:id" element={<ElectiveChoicePage />} />
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
        <Route path={"/subjects/create"} element={<CreateSubjectPage />} />
        <Route path={"/subjectReference"} element={<SubjectReference />} />

        <Route
          path={"/subject-types/create"}
          element={<CreateSubjectTypePage />}
        />
        <Route path={"/departments"} element={<DepartmentsPage />} />
        <Route path={"/students"} element={<StudentsPage />} />
        <Route path={"/courses"} element={<CoursesPage />} />
        <Route path={"/courses/create"} element={<CreateCoursePage />} />
        <Route path={"/subjects"} element={<SubjectsPage />} />
        <Route path={"/faculties/create"} element={<CreateFacultyPage />} />
        <Route path={"/faculties"} element={<FacultiesPage />} />
        <Route path={"/schools"} element={<SchoolsPage />} />
        <Route path={"/schools/create"} element={<CreateSchoolPage />} />
        <Route path={"/departments"} element={<DepartmentsPage />} />
        <Route
          path={"/departments/create"}
          element={<CreateDepartmentPage />}
        />
        <Route path={"/programs"} element={<ProgramsPage />} />
        <Route path={"/programs/create"} element={<CreateProgramPage />} />
      </Routes>
    </BrowserRouter>
  );
}
