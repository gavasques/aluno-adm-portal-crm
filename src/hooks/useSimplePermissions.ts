
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface SimplePermissions {
  hasAdminAccess: boolean;
  allowedMenus: string[];
  loading: boolean;
  error: string | null;
}

export const useSimplePermissions = (): SimplePermissions => {
  const { user, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<SimplePermissions>({
    hasAdminAccess: false,
    allowedMenus: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: [],
        loading: false,
        error: null
      });
      return;
    }

    const fetchPermissions = async () => {
      try {
        console.log('🔍 Buscando permissões para:', user.email);

        // Buscar perfil do usuário
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*, permission_groups(name, is_admin, allow_admin_access)')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.warn('⚠️ Perfil não encontrado, usando permissões padrão');
          setPermissions({
            hasAdminAccess: false,
            allowedMenus: ['student_basic'],
            loading: false,
            error: null
          });
          return;
        }

        // Verificar se é admin
        const isAdmin = profile?.permission_groups?.is_admin || 
                       profile?.permission_groups?.allow_admin_access || 
                       profile?.role === 'Admin';

        // Se for admin, dar acesso total
        if (isAdmin) {
          console.log('✅ Usuário é admin - acesso total');
          setPermissions({
            hasAdminAccess: true,
            allowedMenus: [], // Admin tem acesso a tudo
            loading: false,
            error: null
          });
          return;
        }

        // Para usuários não-admin, buscar menus permitidos
        const { data: menuPermissions, error: menuError } = await supabase
          .from('permission_group_menus')
          .select('menu_key')
          .eq('permission_group_id', profile.permission_group_id);

        if (menuError) {
          console.warn('⚠️ Erro ao buscar menus, usando básico');
          setPermissions({
            hasAdminAccess: false,
            allowedMenus: ['student_basic'],
            loading: false,
            error: null
          });
          return;
        }

        const allowedMenus = menuPermissions?.map(m => m.menu_key) || ['student_basic'];

        console.log('✅ Permissões carregadas:', { isAdmin: false, allowedMenus });

        setPermissions({
          hasAdminAccess: false,
          allowedMenus,
          loading: false,
          error: null
        });

      } catch (err) {
        console.error('❌ Erro ao buscar permissões:', err);
        setPermissions({
          hasAdminAccess: false,
          allowedMenus: ['student_basic'],
          loading: false,
          error: 'Erro ao carregar permissões'
        });
      }
    };

    fetchPermissions();
  }, [user, authLoading]);

  return permissions;
};
