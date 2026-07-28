import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-steel-500" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}