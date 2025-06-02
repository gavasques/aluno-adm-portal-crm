
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

  return {
    users,
    loading: isLoading
  };
};
