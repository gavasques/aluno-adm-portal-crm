
import { useState, useEffect } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import { useAuth } from "@/hooks/auth";

interface Permissions {
  hasAdminAccess: boolean;
  allowedMenus: string[];
}

export const usePermissions = () => {
  const { user, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<Permissions>({
    hasAdminAccess: false,
    allowedMenus: []
  });
  const [loading, setLoading] = useState(true);

  const validationService = PermissionServiceFactory.getPermissionValidationService();
  const menuService = PermissionServiceFactory.getSystemMenuService();

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        console.log("=== PERMISSIONS: No user ===");
        setPermissions({
          hasAdminAccess: false,
          allowedMenus: []
        });
        setLoading(false);
        return;
      }

      try {
        console.log("=== FETCHING PERMISSIONS (SERVICE LAYER) ===");
        console.log("For user:", {
          id: user.id,
          email: user.email
        });

        // Verificar se é admin usando o serviço
        const hasAdminAccess = await validationService.hasAdminAccess();
        
        // Buscar menus permitidos usando o serviço
        const allowedMenus = await menuService.getAllowedMenusForUser();

        const newPermissions = {
          hasAdminAccess,
          allowedMenus
        };

        console.log("Final permissions (via services):", newPermissions);
        console.log("=== PERMISSIONS COMPLETE ===");

        setPermissions(newPermissions);
      } catch (error) {
        console.error("Erro geral ao buscar permissões:", error);
        setPermissions({
          hasAdminAccess: false,
          allowedMenus: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPermissions();
    }
  }, [user?.id, authLoading, validationService, menuService]);

  return { permissions, loading };
};
