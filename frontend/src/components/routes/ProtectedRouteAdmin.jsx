import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRouteAdmin({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}
