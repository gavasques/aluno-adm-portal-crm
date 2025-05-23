
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";

interface UserPermissions {
  hasAdminAccess: boolean;
  allowedMenus: string[];
  permissionGroupId: string | null;
  isAdmin: boolean;
}

export const usePermissions = () => {
  const { user, session } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions>({
    hasAdminAccess: false,
    allowedMenus: [],
    permissionGroupId: null,
    isAdmin: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    if (!user || !session) {
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: [],
        permissionGroupId: null,
        isAdmin: false
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar perfil do usuário com grupo de permissão
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(`
          id,
          role,
          permission_group_id,
          permission_groups (
            id,
            name,
            is_admin,
            allow_admin_access
          )
        `)
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        throw profileError;
      }

      console.log("Perfil encontrado:", profile);

      // Determinar se tem acesso admin
      const hasGroupAdminAccess = profile.permission_groups?.allow_admin_access || false;
      const isAdminRole = profile.role === "Admin";
      const isAdminGroup = profile.permission_groups?.is_admin || false;
      
      // Priorizar permissões de grupo sobre role
      const hasAdminAccess = profile.permission_group_id 
        ? hasGroupAdminAccess 
        : isAdminRole;

      console.log("Verificações de acesso:", {
        hasGroupAdminAccess,
        isAdminRole,
        isAdminGroup,
        hasAdminAccess,
        permissionGroupId: profile.permission_group_id
      });

      // Buscar menus permitidos
      let allowedMenus: string[] = [];
      
      if (hasAdminAccess) {
        // Se tem acesso admin, buscar todos os menus
        const { data: allMenus, error: menusError } = await supabase
          .from("system_menus")
          .select("menu_key");
          
        if (menusError) {
          console.error("Erro ao buscar menus:", menusError);
        } else {
          allowedMenus = allMenus?.map(menu => menu.menu_key) || [];
        }
      } else if (profile.permission_group_id) {
        // Se tem grupo de permissão mas não é admin, buscar menus específicos
        const { data: groupMenus, error: groupMenusError } = await supabase
          .from("permission_group_menus")
          .select("menu_key")
          .eq("permission_group_id", profile.permission_group_id);
          
        if (groupMenusError) {
          console.error("Erro ao buscar menus do grupo:", groupMenusError);
        } else {
          allowedMenus = groupMenus?.map(menu => menu.menu_key) || [];
        }
      }

      console.log("Menus permitidos:", allowedMenus);

      setPermissions({
        hasAdminAccess,
        allowedMenus,
        permissionGroupId: profile.permission_group_id,
        isAdmin: isAdminGroup || isAdminRole
      });

    } catch (err: any) {
      console.error("Erro ao carregar permissões:", err);
      setError("Não foi possível carregar as permissões do usuário");
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: [],
        permissionGroupId: null,
        isAdmin: false
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, session?.access_token]); // Dependências específicas para evitar loops

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    loading,
    error,
    refreshPermissions: fetchPermissions
  };
};
