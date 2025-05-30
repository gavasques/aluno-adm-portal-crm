
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMUser } from '@/types/crm.types';

export const useCRMUsers = () => {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, is_closer, is_onboarding')
        .order('name');

      if (error) throw error;
      
      const usersWithDefaults = data?.map(user => ({
        ...user,
        is_closer: user.is_closer || false,
        is_onboarding: user.is_onboarding || false
      })) || [];
      
      setUsers(usersWithDefaults);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = (query: string) => {
    if (!query) return [];
    
    return users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    users,
    loading,
    searchUsers
  };
};
