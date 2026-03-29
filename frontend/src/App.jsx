import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedLayout from './layout/ProtectedLayout';
import AppLayout from './layout/AppLayout';
import ProfessionalLayout from './layout/ProfessionalLayout';

import ClientsPage from './pages/ClientsPage';
import ScheduleWizard from './pages/ScheduleWizard';
import Dashboard from './pages/Dashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from "./pages/ReportsPage";
import BookPublic from "./pages/BookPublic";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import ProfessionalAppointments from "./pages/ProfessionalAppointments";

function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/book/:slug" element={<BookPublic />} />
      <Route path="/:slug/login" element={<LoginPage />} />

      {/* 🔒 ADMIN */}
      <Route element={<ProtectedLayout />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/schedule" element={<ScheduleWizard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* 🔒 PROFESSIONAL */}
      <Route element={<ProfessionalLayout />}>
        <Route path="/professional" element={<ProfessionalDashboard />} />
        <Route path="/professional/appointments" element={<ProfessionalAppointments />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;