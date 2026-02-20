import { Navigate } from 'react-router-dom';
import Spinner from '@components/Spinner';
import { useAuth } from '@context/auth/useAuth';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
