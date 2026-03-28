import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedLayout from './layout/ProtectedLayout';
import ClientsPage from './pages/ClientsPage';
import ScheduleWizard from './pages/ScheduleWizard';
import Dashboard from './pages/Dashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from "./pages/ReportsPage";
import BookPublic from "./pages/BookPublic";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";

function App() {
  return (
    <Routes>
      {/* 🔥 ROTA PÚBLICA */}
      <Route path="/book/:slug" element={<BookPublic />} />

      {/* 🔥 LOGIN (COM SLUG) */}
      <Route path="/:slug/login" element={<LoginPage />} />

      {/* 🔒 ROTAS ADMIN (COM LAYOUT) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/schedule" element={<ScheduleWizard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      {/* 🔥 PROFISSIONAL (SEM LAYOUT DO ADMIN) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/professional" element={<ProfessionalDashboard />} />
      </Route>

      {/* 🔁 FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;