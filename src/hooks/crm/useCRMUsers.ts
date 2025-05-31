
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMUser } from '@/types/crm.types';

export const useCRMUsers = () => {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, avatar_url, role, created_at')
          .order('name');

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading };
};
