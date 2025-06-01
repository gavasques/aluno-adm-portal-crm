
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMUser } from '@/types/crm.types';

export const useCRMUsers = () => {
  // Usar React Query para cache otimizado de usuários
  const { data: users = [], isLoading: loading, error } = useQuery({
    queryKey: ['crm-users'],
    queryFn: async () => {
      console.log('🔍 Fetching CRM users...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url, role, created_at')
        .order('name');

      if (error) throw error;
      console.log(`✅ Loaded ${data?.length || 0} users`);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - dados de usuários são estáticos
    refetchOnWindowFocus: false,
  });

  const searchUsers = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url, role')
        .ilike('name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  };

  return { users, loading, error, searchUsers };
};
