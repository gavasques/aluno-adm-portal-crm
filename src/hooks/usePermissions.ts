
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface Permissions {
  hasAdminAccess: boolean;
  allowedMenus: string[];
  isLoading: boolean;
}

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permissions>({
    hasAdminAccess: false,
    allowedMenus: [],
    isLoading: true
  });

  const fetchPermissions = useCallback(async () => {
    if (!user) {
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: [],
        isLoading: false
      });
      return;
    }

    try {
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          permission_group:permission_groups(
            *,
            menus:permission_group_menus(menu_key)
          )
        `)
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      const hasAdminAccess = profile?.permission_group?.allow_admin_access || false;
      const allowedMenus = profile?.permission_group?.menus?.map((menu: any) => menu.menu_key) || [];

      setPermissions({
        hasAdminAccess,
        allowedMenus,
        isLoading: false
      });
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: [],
        isLoading: false
      });
    }
  }, [user]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    loading: permissions.isLoading,
    refetch: fetchPermissions
  };
};
