
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
    console.log("=== FETCHING PERMISSIONS ===");
    console.log("User:", user?.email);

    if (!user) {
      console.log("No user - setting default permissions");
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

      console.log("Profile data:", profile);
      console.log("Profile error:", profileError);

      // Se não encontrar perfil, permitir acesso básico à área do aluno
      if (profileError && profileError.code === 'PGRST116') {
        console.log("No profile found - allowing basic student access");
        setPermissions({
          hasAdminAccess: false,
          allowedMenus: ['student_basic'], // Permitir acesso básico
          isLoading: false
        });
        return;
      }

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        // Em caso de erro, permitir acesso básico
        setPermissions({
          hasAdminAccess: false,
          allowedMenus: ['student_basic'],
          isLoading: false
        });
        return;
      }

      const hasAdminAccess = profile?.permission_group?.allow_admin_access || false;
      const allowedMenus = profile?.permission_group?.menus?.map((menu: any) => menu.menu_key) || [];

      // Se não tem grupo de permissão, permitir acesso básico à área do aluno
      if (!profile?.permission_group) {
        console.log("No permission group - allowing basic student access");
        allowedMenus.push('student_basic');
      }

      console.log("Final permissions:", { hasAdminAccess, allowedMenus });

      setPermissions({
        hasAdminAccess,
        allowedMenus,
        isLoading: false
      });
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
      // Em caso de erro, permitir acesso básico
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: ['student_basic'],
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
