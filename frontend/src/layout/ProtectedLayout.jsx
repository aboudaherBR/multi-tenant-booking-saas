import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/salao-rocha/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;