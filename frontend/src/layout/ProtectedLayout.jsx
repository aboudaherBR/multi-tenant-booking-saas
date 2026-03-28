import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import AppLayout from './AppLayout';

function ProtectedLayout() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/salao-rocha/login" replace />;
  }

  if (user?.isProfessional && window.location.pathname !== '/professional') {
  return <Navigate to="/professional" replace />;
}

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default ProtectedLayout;