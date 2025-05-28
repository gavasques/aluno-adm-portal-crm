
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PermissionServiceFactory } from '@/services/permissions';
import { queryKeys } from '@/config/queryClient';

interface OptimizedAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  permissions: {
    hasAdminAccess: boolean;
    allowedMenus: string[];
    isLoaded: boolean;
  };
}

export const useOptimizedAuth = () => {
  const [authState, setAuthState] = useState<OptimizedAuthState>({
    user: null,
    session: null,
    loading: true,
    permissions: {
      hasAdminAccess: false,
      allowedMenus: [],
      isLoaded: false
    }
  });

  const queryClient = useQueryClient();
  const isUnmountedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  // Optimized permissions query with proper caching
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    error: permissionsError
  } = useQuery({
    queryKey: queryKeys.userPermissions(authState.user?.id || 'anonymous'),
    queryFn: async () => {
      if (!authState.user) return { hasAdminAccess: false, allowedMenus: [] };
      
      const validationService = PermissionServiceFactory.getPermissionValidationService();
      const menuService = PermissionServiceFactory.getSystemMenuService();

      const [hasAdminAccess, allowedMenus] = await Promise.all([
        validationService.hasAdminAccess(),
        menuService.getAllowedMenusForUser()
      ]);

      return { hasAdminAccess, allowedMenus };
    },
    enabled: !!authState.user && !authState.loading,
    staleTime: 10 * 60 * 1000, // 10 minutes for permissions
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  });

  // Initialize session and set up auth listener
  useEffect(() => {
    isUnmountedRef.current = false;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isUnmountedRef.current) {
          setAuthState(prev => ({
            ...prev,
            user: session?.user || null,
            session: session || null,
            loading: false
          }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (!isUnmountedRef.current) {
          setAuthState(prev => ({
            ...prev,
            loading: false
          }));
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isUnmountedRef.current) {
          setAuthState(prev => ({
            ...prev,
            user: session?.user || null,
            session: session || null,
            loading: false
          }));

          // Clear relevant caches when user changes
          if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
            queryClient.clear();
          }
        }
      }
    );

    initializeAuth();

    return () => {
      isUnmountedRef.current = true;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Update permissions when permissions data changes
  useEffect(() => {
    if (permissionsData && !permissionsLoading) {
      setAuthState(prev => ({
        ...prev,
        permissions: {
          hasAdminAccess: permissionsData.hasAdminAccess,
          allowedMenus: permissionsData.allowedMenus,
          isLoaded: true
        }
      }));
    }
  }, [permissionsData, permissionsLoading]);

  // Memoized auth methods
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      queryClient.clear();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [queryClient]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }, []);

  // Memoized computed values
  const computedValues = useMemo(() => ({
    isAuthenticated: !!authState.user,
    isAdmin: authState.permissions.hasAdminAccess,
    canAccessMenu: (menuKey: string) => 
      authState.permissions.hasAdminAccess || authState.permissions.allowedMenus.includes(menuKey),
    isLoading: authState.loading || (!!authState.user && permissionsLoading),
    hasPermissions: authState.permissions.isLoaded
  }), [
    authState.user, 
    authState.loading, 
    authState.permissions.hasAdminAccess, 
    authState.permissions.allowedMenus, 
    authState.permissions.isLoaded,
    permissionsLoading
  ]);

  return {
    // State
    user: authState.user,
    session: authState.session,
    loading: computedValues.isLoading,
    
    // Permissions
    permissions: authState.permissions,
    isAuthenticated: computedValues.isAuthenticated,
    isAdmin: computedValues.isAdmin,
    canAccessMenu: computedValues.canAccessMenu,
    hasPermissions: computedValues.hasPermissions,
    
    // Methods
    signOut,
    signIn,
    resetPassword,
    
    // Errors
    permissionsError
  };
};
