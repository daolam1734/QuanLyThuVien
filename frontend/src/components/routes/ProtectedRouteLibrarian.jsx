import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRouteLibrarian({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== 'librarian') {
    return <Navigate to="/" />;
  }

  return children;
}
