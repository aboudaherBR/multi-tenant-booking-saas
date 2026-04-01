import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/AuthContext'; // 🔥 ADICIONADO

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
import ProfessionalLayout from "./layout/ProfessionalLayout";

function App() {
  const { isAuthenticated, user } = useAuth(); // 🔥 ADICIONADO

  return (
    <Routes>
      {/* 🔥 ROTA PÚBLICA (TEM QUE VIR ANTES) */}
      <Route path="/book/:slug" element={<BookPublic />} />

      {/* LOGIN */}
      <Route path="/:slug/login" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ROTAS ADMIN */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/schedule" element={<ScheduleWizard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      {/* 🔥 ROTA PROFISSIONAL PROTEGIDA */}
      <Route
        element={
          isAuthenticated && user?.isProfessional
            ? <ProfessionalLayout />
            : <Navigate to="/login" />
        }
      >
        <Route path="/professional" element={<ProfessionalDashboard />} />
        <Route path="/professional/schedule" element={<ProfessionalSchedulePage />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;