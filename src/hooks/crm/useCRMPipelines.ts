
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCRMPipelines = () => {
  const { data: pipelines = [], isLoading } = useQuery({
    queryKey: ['crm-pipelines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .select(`
          *,
          columns:crm_pipeline_columns(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      return (data || []).map(pipeline => ({
        ...pipeline,
        columns: (pipeline.columns || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      }));
    }
  });

  return {
    pipelines,
    isLoading
  };
};
