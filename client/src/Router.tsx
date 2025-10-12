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
import ViewStudentsAllotmentsPage from "./pages/ViewStudentsAllotmentsPage.tsx";
import SubjectTypesPage from "./pages/SubjectPages/SubjectTypesPage.tsx";
import SubjectTypeEditPage from "./pages/SubjectTypePages/SubjectTypeEditPage.tsx";
import ElectiveSectionsPage from "./pages/SectionPages/ElectiveSectionsPage.tsx";
import ProfessorsPage from "./pages/ProfessorsPages/ProfessorsPage.tsx";
import ViewDepartmentPage from "./pages/DepartmentPages/ViewDepartmentPage.tsx";
import ViewSchoolPage from "./pages/SchoolPages/ViewSchoolPage.tsx";
import ViewFacultyPage from "./pages/FacultyPage/ViewFacultyPage.tsx";
import ViewProgramPage from "./pages/ProgramPages/ViewProgramPage.tsx";
import ViewCourseBucketPage from "./pages/CourseBucketPages/ViewCourseBucketPage.tsx";
import ViewStudentPage from "./pages/StudentPages/ViewStudentPage.tsx";
import ViewProfessorPage from "./pages/ProfessorsPages/ViewProfessorPage.tsx";
import CreateProfessorPage from "./pages/ProfessorsPages/ProfessorsCreate.tsx";
import StudentsCreate from "./pages/StudentPages/StudentsCreate.tsx";
import Admin from "./pages/AdminRegister.tsx";
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
          path="/subject-types"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <SubjectTypesPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/subject-types/:id/edit"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <SubjectTypeEditPage />
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
          path="/departments/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewDepartmentPage />
            </RoleWrapper>
          }
        />
          <Route
          path="/Admins"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <Admin />
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
          path="/students/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <StudentsCreate />
            </RoleWrapper>
          }
        />
        <Route
          path="/students/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewStudentPage />
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
          path="/faculties/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewFacultyPage />
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
          path="/schools/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewSchoolPage />
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
          path="/programs/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewProgramPage />
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
          path="/course-buckets/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewCourseBucketPage />
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
        <Route
          path="/my-subjects"
          element={
            <RoleWrapper requiredRoles={[UserRole.STUDENT]}>
              <ViewStudentsAllotmentsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/elective-sections/:subjectCourseWithSeatsId"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ElectiveSectionsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/professors"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ProfessorsPage />
            </RoleWrapper>
          }
        />
        <Route
          path="/professors/:id"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <ViewProfessorPage />
            </RoleWrapper>
          }
        />
         <Route
          path="/professors/create"
          element={
            <RoleWrapper requiredRoles={[UserRole.ADMIN]}>
              <CreateProfessorPage />
            </RoleWrapper>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </BrowserRouter>
  );
}
