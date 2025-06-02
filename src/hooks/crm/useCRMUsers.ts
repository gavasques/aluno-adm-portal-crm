
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMUser } from '@/types/crm.types';

export const useCRMUsers = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['crm-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .order('name');

      if (error) throw error;

      return data.map(user => ({
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        avatar_url: user.avatar_url
      })) as CRMUser[];
    }
  });

  const searchUsers = async (query: string): Promise<CRMUser[]> => {
    if (!query.trim()) return users;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name')
      .limit(10);

    if (error) throw error;

    return data.map(user => ({
      id: user.id,
      name: user.name || user.email,
      email: user.email,
      avatar_url: user.avatar_url
    })) as CRMUser[];
  };

  return {
    users,
    loading: isLoading,
    searchUsers
  };
};
