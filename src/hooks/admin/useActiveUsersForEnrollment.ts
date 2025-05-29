
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
      console.log('🔍 Buscando usuários ativos para inscrição...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, status')
        .eq('status', 'Ativo')
        .order('name');

      if (error) {
        console.error('❌ Erro ao buscar usuários:', error);
        setUsers([]);
        return;
      }

      console.log('✅ Dados brutos recebidos:', data);

      const usersData = data?.map(profile => ({
        id: profile.id,
        name: profile.name || profile.email?.split('@')[0] || 'Usuário sem nome',
        email: profile.email || '',
        status: profile.status || 'Ativo'
      })) || [];

      console.log('📊 Usuários processados:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('❌ Erro capturado ao buscar usuários:', error);
      setUsers([]);
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
