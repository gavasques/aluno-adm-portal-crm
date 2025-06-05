
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { usePermissions } from '@/hooks/usePermissions';

export const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();

  useEffect(() => {
    console.log('=== ROUTE DEBUGGER ===');
    console.log('Current path:', location.pathname);
    console.log('User:', user ? { id: user.id, email: user.email } : 'Not logged in');
    console.log('Auth loading:', authLoading);
    console.log('Permissions:', permissions);
    console.log('Permissions loading:', permissionsLoading);
    console.log('Has admin access:', permissions.hasAdminAccess);
    console.log('======================');
  }, [location.pathname, user, authLoading, permissions, permissionsLoading]);

  return null;
};
