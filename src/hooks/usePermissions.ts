
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
        console.log("=== FETCHING PERMISSIONS ===");
        console.log("For user:", {
          id: user.id,
          email: user.email
        });

        // Verificar se é admin
        const { data: isAdminData, error: adminError } = await supabase
          .rpc('is_admin');

        if (adminError) {
          console.error("Erro ao verificar se é admin:", adminError);
        }

        console.log("Is admin result:", isAdminData);

        // Buscar menus permitidos
        const { data: menusData, error: menusError } = await supabase
          .rpc('get_allowed_menus');

        if (menusError) {
          console.error("Erro ao buscar menus permitidos:", menusError);
        }

        console.log("Allowed menus result:", menusData);

        const newPermissions = {
          hasAdminAccess: !!isAdminData,
          allowedMenus: menusData?.map((item: any) => item.menu_key) || []
        };

        console.log("Final permissions:", newPermissions);
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
  }, [user?.id, authLoading]);

  return { permissions, loading };
};
