
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMUser } from '@/types/crm.types';

export const useCRMUsers = () => {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, is_closer, is_onboarding, role')
        .or('is_closer.eq.true,is_onboarding.eq.true,role.eq.Admin')
        .order('name');

      if (error) throw error;

      const transformedUsers: CRMUser[] = (data || []).map(user => ({
        id: user.id,
        name: user.name || 'Usuário',
        email: user.email,
        is_closer: user.is_closer || false,
        is_onboarding: user.is_onboarding || false,
        role: user.role || 'Student'
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários CRM:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = (query: string): CRMUser[] => {
    if (!query.trim()) return users;
    
    const searchTerm = query.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    searchUsers
  };
};
