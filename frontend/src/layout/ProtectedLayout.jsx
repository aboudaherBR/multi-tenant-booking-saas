import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import AppLayout from './AppLayout';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  alert(`AUTH: ${isAuthenticated} | LOADING: ${loading}`);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default ProtectedLayout;