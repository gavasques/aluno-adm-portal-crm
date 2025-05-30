
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMUser } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMUsers = () => {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCRMUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          name, 
          email, 
          is_closer, 
          is_onboarding, 
          role,
          permission_groups!profiles_permission_group_id_fkey(is_admin, allow_admin_access)
        `)
        .or('is_closer.eq.true,is_onboarding.eq.true,permission_groups.is_admin.eq.true,permission_groups.allow_admin_access.eq.true');

      if (error) throw error;

      const transformedUsers = data?.map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email,
        is_closer: user.is_closer,
        is_onboarding: user.is_onboarding,
        role: user.role
      })) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários do CRM:', error);
      toast.error('Erro ao carregar usuários');
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      await fetchCRMUsers();
      setLoading(false);
    };

    loadUsers();
  }, []);

  return {
    users,
    loading,
    fetchCRMUsers
  };
};
