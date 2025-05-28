
import React, { memo, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOptimizedAuth } from '@/hooks/auth/useOptimizedAuth';
import AccessDenied from '@/components/admin/AccessDenied';

interface OptimizedRouteGuardProps {
  children: React.ReactNode;
  requireAdminAccess?: boolean;
  requiredMenuKey?: string;
}

const OptimizedRouteGuard = memo(({ 
  children, 
  requireAdminAccess = false,
  requiredMenuKey 
}: OptimizedRouteGuardProps) => {
  const { 
    user, 
    loading, 
    isAdmin, 
    canAccessMenu, 
    hasPermissions 
  } = useOptimizedAuth();
  
  const location = useLocation();

  // Memoize loading component
  const loadingComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ), []);

  // Memoize permission check
  const hasRequiredPermissions = useMemo(() => {
    if (!hasPermissions) return null; // Still loading permissions
    
    if (requireAdminAccess) {
      return isAdmin;
    }
    
    if (requiredMenuKey) {
      return canAccessMenu(requiredMenuKey);
    }
    
    return true; // No specific permission required
  }, [hasPermissions, requireAdminAccess, requiredMenuKey, isAdmin, canAccessMenu]);

  // Show loading while auth or permissions are loading
  if (loading || !hasPermissions) {
    return loadingComponent;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions
  if (hasRequiredPermissions === false) {
    return <AccessDenied />;
  }

  return <>{children}</>;
});

OptimizedRouteGuard.displayName = 'OptimizedRouteGuard';

export default OptimizedRouteGuard;
