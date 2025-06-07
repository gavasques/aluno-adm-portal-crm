
import React, { memo, useMemo } from 'react';
import { useAuth } from '@/hooks/auth';
import { useSimplePermissions } from '@/hooks/useSimplePermissions';
import Login from '@/pages/Login';

interface OptimizedProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const OptimizedProtectedRoute = memo(({ children, requireAdmin = false }: OptimizedProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { hasAdminAccess, loading: permissionsLoading } = useSimplePermissions();

  // Memoize loading state
  const loadingComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ), []);

  // Memoize access denied component
  const accessDeniedComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
        <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
      </div>
    </div>
  ), []);

  // Show loading while auth or permissions are loading
  if (loading || permissionsLoading) {
    return loadingComponent;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Login />;
  }

  // Check admin access if required
  if (requireAdmin && !hasAdminAccess) {
    return accessDeniedComponent;
  }

  return <>{children}</>;
});

OptimizedProtectedRoute.displayName = 'OptimizedProtectedRoute';

export default OptimizedProtectedRoute;
