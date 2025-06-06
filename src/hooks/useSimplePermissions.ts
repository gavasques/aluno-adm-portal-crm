
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

        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            *,
            permission_groups (
              name,
              permissions
            )
          `)
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('⚠️ Perfil não encontrado, usando permissões padrão');
          setPermissions({
            hasAdminAccess: false,
            allowedMenus: ['student_basic'],
            loading: false,
            error: null
          });
          return;
        }

        const isAdmin = profile?.permission_groups?.name === 'admin';
        const permissions_data = profile?.permission_groups?.permissions || {};
        const allowedMenus = Object.keys(permissions_data).filter(key => permissions_data[key] === true);

        console.log('✅ Permissões carregadas:', { isAdmin, allowedMenus });

        setPermissions({
          hasAdminAccess: isAdmin,
          allowedMenus: isAdmin ? [] : allowedMenus, // Admin tem acesso total
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
