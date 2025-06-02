
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMTag } from '@/types/crm.types';

export const useCRMTags = () => {
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['crm-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_tags')
        .select('*')
        .order('name');

      if (error) throw error;

      return data as CRMTag[];
    }
  });

  return {
    tags,
    loading: isLoading
  };
};
