import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedLayout from './layout/ProtectedLayout';
import ClientsPage from './pages/ClientsPage';
import ScheduleWizard from './pages/ScheduleWizard';
import Dashboard from './pages/Dashboard';
import AppointmentsPage from './pages/AppointmentsPage';

function App() {
  return (
    <Routes>
      <Route path="/:slug/login" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/schedule" element={<ScheduleWizard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;