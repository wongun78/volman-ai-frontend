import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    // Not logged in - redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    // Logged in but missing required role - show error or redirect
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
          <p className="text-gray-500 mt-2">Required role: {requiredRole}</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
