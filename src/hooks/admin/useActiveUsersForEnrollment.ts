
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

export const useActiveUsersForEnrollment = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, status')
        .eq('status', 'Ativo')
        .order('name');

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        return;
      }

      const usersData = data?.map(profile => ({
        id: profile.id,
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        status: profile.status
      })) || [];

      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    refetch: fetchUsers
  };
};
