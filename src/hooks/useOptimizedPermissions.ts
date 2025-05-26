
import { useState, useEffect, useRef } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import { useAuth } from "@/hooks/auth";

interface OptimizedPermissions {
  hasAdminAccess: boolean;
  allowedMenus: string[];
}

export const useOptimizedPermissions = () => {
  const { user, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<OptimizedPermissions>({
    hasAdminAccess: false,
    allowedMenus: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs para evitar loops infinitos
  const isUnmountedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    isUnmountedRef.current = false;
    
    const fetchPermissions = async () => {
      // Evitar refetch desnecessário
      if (lastUserIdRef.current === user?.id) {
        return;
      }
      
      if (!user || authLoading) {
        if (!authLoading) {
          setPermissions({ hasAdminAccess: false, allowedMenus: [] });
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const validationService = PermissionServiceFactory.getPermissionValidationService();
        const menuService = PermissionServiceFactory.getSystemMenuService();

        const [hasAdminAccess, allowedMenus] = await Promise.all([
          validationService.hasAdminAccess(),
          menuService.getAllowedMenusForUser()
        ]);

        if (!isUnmountedRef.current) {
          setPermissions({ hasAdminAccess, allowedMenus });
          lastUserIdRef.current = user.id;
        }
      } catch (error) {
        console.error('Erro ao buscar permissões:', error);
        if (!isUnmountedRef.current) {
          setError('Erro ao carregar permissões');
          setPermissions({ hasAdminAccess: false, allowedMenus: [] });
        }
      } finally {
        if (!isUnmountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchPermissions();

    return () => {
      isUnmountedRef.current = true;
    };
  }, [user?.id, authLoading]); // Dependências específicas

  return { permissions, loading: loading || authLoading, error };
};
