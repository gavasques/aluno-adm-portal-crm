
import { useState, useEffect } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import { useAuth } from "@/hooks/auth";
import { useOptimizedPermissions } from "./useOptimizedPermissions";

interface Permissions {
  hasAdminAccess: boolean;
  allowedMenus: string[];
}

export const usePermissions = (useOptimization: boolean = true) => {
  const { user, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<Permissions>({
    hasAdminAccess: false,
    allowedMenus: []
  });
  const [loading, setLoading] = useState(true);

  // Hook otimizado
  const optimizedResult = useOptimizedPermissions();

  useEffect(() => {
    // Se está usando otimização, usar o resultado otimizado
    if (useOptimization) {
      setPermissions({
        hasAdminAccess: optimizedResult.permissions.hasAdminAccess,
        allowedMenus: optimizedResult.permissions.allowedMenus
      });
      setLoading(optimizedResult.loading);
      return;
    }

    // Fallback para implementação original apenas se necessário
    const fetchPermissions = async () => {
      if (!user || authLoading) {
        if (!authLoading) {
          setPermissions({ hasAdminAccess: false, allowedMenus: [] });
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        
        const validationService = PermissionServiceFactory.getPermissionValidationService();
        const menuService = PermissionServiceFactory.getSystemMenuService();

        const [hasAdminAccess, allowedMenus] = await Promise.all([
          validationService.hasAdminAccess(),
          menuService.getAllowedMenusForUser()
        ]);

        setPermissions({ hasAdminAccess, allowedMenus });
      } catch (error) {
        console.error('Erro ao buscar permissões:', error);
        setPermissions({ hasAdminAccess: false, allowedMenus: [] });
      } finally {
        setLoading(false);
      }
    };

    if (!useOptimization) {
      fetchPermissions();
    }
  }, [user?.id, authLoading, useOptimization, optimizedResult.permissions, optimizedResult.loading]);

  return { permissions, loading };
};
