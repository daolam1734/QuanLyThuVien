import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }

  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" />; // Trang 403 rõ ràng hơn
  }

  return children;
}
