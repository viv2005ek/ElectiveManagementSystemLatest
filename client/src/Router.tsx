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
import SubjectsPage from "./pages/SubjectsPage.tsx";
import CreateCourseBucketPage from "./pages/CreateCourseBucketPage.tsx";
import CourseBucketsPage from "./pages/CourseBucketsPage.tsx";
import ViewCoursePage from "./pages/ViewCoursePage.tsx";
import SubjectPreferencesPage from "./pages/SubjectPreferencesPage.tsx";
import RoleWrapper from "./hocs/RoleWrapper.tsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.tsx";
import { UserRole } from "./types/UserTypes.ts";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN, UserRole.STUDENT]}>
              <StudentsLandingPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/choose/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ElectiveChoicePage />
            </RoleWrapper>
          }
        />
        <Route
          path="/minor-specializations"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <MinorSpecializationsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/user-profile"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <UserProfilePage />
            </RoleWrapper>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <AdminPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/ems"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ElectiveManagementSystem />
            </RoleWrapper>
          }
        />
        <Route
          path="/oe"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <OpenElective />
            </RoleWrapper>
          }
        />
        <Route
          path="/oemanage"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ManageOEPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/emsadmin"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <EMSAdmin />
            </RoleWrapper>
          }
        />
        <Route
          path="/*"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <NotFoundPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/subjects/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateSubjectPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/subject-types/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateSubjectTypePage />
            </RoleWrapper>
          }
        />
        <Route
          path="/departments"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <DepartmentsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/students"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <StudentsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/courses"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CoursesPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/courses/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateCoursePage />
            </RoleWrapper>
          }
        />
        <Route
          path="/subjects"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <SubjectsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/faculties/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateFacultyPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/faculties"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <FacultiesPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/schools"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <SchoolsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/schools/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateSchoolPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/departments/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateDepartmentPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/programs"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ProgramsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/programs/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateProgramPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/course-buckets"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CourseBucketsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/course-buckets/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateCourseBucketPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewCoursePage />
            </RoleWrapper>
          }
        />
        <Route
          path="/subjects/:id/preferences"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <SubjectPreferencesPage />
            </RoleWrapper>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </BrowserRouter>
  );
}
