import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import StudentsLandingPage from "./pages/StudentsLandingPage.tsx";
import ElectiveChoicePage from "./pages/ElectiveChoicePage.tsx";
import OpenElectivesPage from "./pages/OpenElectivesPage.tsx";
import AllStudentList from "./pages/AllStudentListPage.tsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<StudentsLandingPage />} />
        <Route path="/choose/:id" element={<ElectiveChoicePage />} />
        <Route path="/open-electives" element={<OpenElectivesPage />} />
        <Route path="/student-list" element={<AllStudentList />} />
      </Routes>
    </BrowserRouter>
  );
}
