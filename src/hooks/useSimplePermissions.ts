
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
    allowedMenus: ['student_basic'],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: ['student_basic'],
        loading: false,
        error: null
      });
      return;
    }

    const fetchPermissions = async () => {
      try {
        console.log('🔍 Buscando permissões para:', user.email);

        // Timeout para evitar travamento
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );

        const profilePromise = supabase
          .from('profiles')
          .select('*, permission_groups(name, is_admin, allow_admin_access)')
          .eq('id', user.id)
          .single();

        const { data: profile, error: profileError } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (profileError) {
          console.warn('⚠️ Erro ao buscar perfil, usando permissões básicas:', profileError);
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

        if (isAdmin) {
          console.log('✅ Usuário é admin');
          setPermissions({
            hasAdminAccess: true,
            allowedMenus: [],
            loading: false,
            error: null
          });
          return;
        }

        // Usuários não-admin recebem acesso básico
        console.log('✅ Usuário com acesso básico');
        setPermissions({
          hasAdminAccess: false,
          allowedMenus: ['student_basic'],
          loading: false,
          error: null
        });

      } catch (err) {
        console.warn('⚠️ Erro ao buscar permissões, usando básico:', err);
        setPermissions({
          hasAdminAccess: false,
          allowedMenus: ['student_basic'],
          loading: false,
          error: null
        });
      }
    };

    fetchPermissions();
  }, [user, authLoading]);

  return permissions;
};
