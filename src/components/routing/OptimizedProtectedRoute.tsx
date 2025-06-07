
import React, { memo } from 'react';
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

  console.log('🛡️ ProtectedRoute:', { 
    hasUser: !!user, 
    loading, 
    requireAdmin, 
    hasAdminAccess, 
    permissionsLoading 
  });

  // Show loading while checking auth
  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('🔒 No user, showing login');
    return <Login />;
  }

  // Check admin access if required
  if (requireAdmin && !hasAdminAccess) {
    console.log('❌ Admin required but user has no admin access');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  console.log('✅ Access granted, rendering children');
  return <>{children}</>;
});

OptimizedProtectedRoute.displayName = 'OptimizedProtectedRoute';

export default OptimizedProtectedRoute;
