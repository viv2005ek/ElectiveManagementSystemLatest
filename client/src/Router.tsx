import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx';
import StudentsLandingPage from './pages/StudentsLandingPage.tsx';
import ElectiveChoicePage from './pages/ElectiveChoicePage.tsx';
import OpenElectivesTable from './components/OpenElectivesTable.tsx';
import OpenElectivesPage from './pages/OpenElectivesPage.tsx';

export default function Router () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<StudentsLandingPage />} />
        <Route path="/choose/:id" element={<ElectiveChoicePage />} />
        <Route path="/open-electives" element={<OpenElectivesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
