import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import AppLayout from './AppLayout';


function ProtectedLayout() {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/salao-rocha/login" replace />;
  }

  // 🔥 BLOQUEIO DE ADMIN PARA PROFISSIONAL
  if (user?.isProfessional && location.pathname !== '/professional') {
    return <Navigate to="/professional" replace />;
  }

  // 🔥 PROFISSIONAL NÃO USA AppLayout
  if (location.pathname === '/professional') {
    return <Outlet />;
  }

  // 🔥 ADMIN USA AppLayout
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default ProtectedLayout;