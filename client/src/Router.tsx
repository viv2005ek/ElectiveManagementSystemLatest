import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/AuthPages/LoginPage.tsx";
import ActiveSubjectsPage from "./pages/SubjectPages/ActiveSubjectsPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import DepartmentsPage from "./pages/DepartmentPages/DepartmentsPage.tsx";
import StudentsPage from "./pages/StudentPages/StudentsPage.tsx";
import CoursesPage from "./pages/CoursePages/CoursesPage.tsx";
import CreateFacultyPage from "./pages/FacultyPage/CreateFacultyPage.tsx";
import FacultiesPage from "./pages/FacultyPage/FacultiesPage.tsx";
import CreateSchoolPage from "./pages/SchoolPages/CreateSchoolPage.tsx";
import SchoolsPage from "./pages/SchoolPages/SchoolsPage.tsx";
import CreateDepartmentPage from "./pages/DepartmentPages/CreateDepartmentPage.tsx";
import CreateProgramPage from "./pages/ProgramPages/CreateProgramPage.tsx";
import ProgramsPage from "./pages/ProgramPages/ProgramsPage.tsx";
import CreateSubjectPage from "./pages/SubjectPages/CreateSubjectPage.tsx";
import CreateCoursePage from "./pages/CoursePages/CreateCoursePage.tsx";
import CreateSubjectTypePage from "./pages/SubjectPages/CreateSubjectTypePage.tsx";
import SubjectsPage from "./pages/SubjectPages/SubjectsPage.tsx";
import CreateCourseBucketPage from "./pages/CourseBucketPages/CreateCourseBucketPage.tsx";
import CourseBucketsPage from "./pages/CourseBucketPages/CourseBucketsPage.tsx";
import ViewCoursePage from "./pages/CoursePages/ViewCoursePage.tsx";
import SubjectViewPage from "./pages/SubjectPages/SubjectViewPage.tsx";
import RoleWrapper from "./hocs/RoleWrapper.tsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.tsx";
import { UserRole } from "./types/UserTypes.ts";
import SubjectPreferencesFillingPage from "./pages/SubjectPages/SubjectPreferencesFillingPage.tsx";
import SubjectPreferencesPage from "./pages/SubjectPages/SubjectPreferencesPage.tsx";
import SubjectPreferencesUpdatingPage from "./pages/SubjectPages/SubjectPreferencesUpdatingPage.tsx";
import ViewSubjectAllotmentsPage from "./pages/AllotmentPage/ViewSubjectAllotmentsPage.tsx";

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
              <ActiveSubjectsPage />
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
          path="/subjects/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <SubjectViewPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/subjects/:id/preferences-fill"
          element={
            <RoleWrapper requiredRoles={[UserRole.STUDENT]}>
              <SubjectPreferencesFillingPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/subjects/:id/preferences-update"
          element={
            <RoleWrapper requiredRoles={[UserRole.STUDENT]}>
              <SubjectPreferencesUpdatingPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/subjects/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <SubjectViewPage />
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
        <Route
          path="/subjects/:id/allotments"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewSubjectAllotmentsPage />
            </RoleWrapper>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </BrowserRouter>
  );
}
